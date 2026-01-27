'use client';

import { useState } from 'react';
import { useTodosContext } from '../../context/TodosContext';
import { useAuth } from '../../context/AuthContext';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList = () => {
  const { todos, loading, error, fetchTodos, setFilters } = useTodosContext();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'priority' | 'title'>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const userId = user?.id || '';

  // Apply filters and sorting to the todos
  const filteredTodos = todos.filter(todo => {
    if (filterStatus === 'pending') return !todo.completed;
    if (filterStatus === 'completed') return todo.completed;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  const searchedTodos = sortedTodos.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFilterChange = () => {
    setFilters({
      status: filterStatus,
      sort_by: sortBy,
      order,
      search_term: searchTerm,
    });

    if (userId) {
      fetchTodos(userId, {
        status: filterStatus,
        sort_by: sortBy,
        order,
        search_term: searchTerm,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            {showForm ? 'Cancel' : '+ Add Task'}
          </button>

          <div className="flex items-center space-x-2">
            <label htmlFor="search" className="text-sm text-gray-600">Search:</label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter tasks..."
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <TodoForm userId={userId} onClose={() => setShowForm(false)} />
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="status-filter" className="text-sm text-gray-600">Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="sort-by" className="text-sm text-gray-600">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="created_at">Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="order" className="text-sm text-gray-600">Order:</label>
          <select
            id="order"
            value={order}
            onChange={(e) => setOrder(e.target.value as any)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <button
          onClick={handleFilterChange}
          className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Apply
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : searchedTodos.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">
            {todos.length === 0
              ? "Get started by creating a new task."
              : "No tasks match your current filters."}
          </p>
          {!showForm && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create your first task
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {searchedTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} userId={userId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;