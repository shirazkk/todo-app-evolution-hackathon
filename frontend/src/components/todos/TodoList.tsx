'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTodosContext } from '@/context/TodosContext';
import { useAuth } from '@/hooks/useAuth';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Search,
  Filter,
  RotateCcw,
  Calendar,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  Circle
} from 'lucide-react';

const TodoList = () => {
  const { todos, loading, error, fetchTodos } = useTodosContext();
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
    if (userId) {
      fetchTodos(userId, {
        status: filterStatus,
        sort_by: sortBy,
        order,
        search_term: searchTerm,
      });
    }
  };

  const handleResetFilters = () => {
    setFilterStatus('all');
    setSortBy('created_at');
    setOrder('desc');
    setSearchTerm('');
    if (userId) {
      fetchTodos(userId);
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-white">Your Tasks</CardTitle>
            <p className="text-slate-400 mt-1">
              {searchedTodos.length} {searchedTodos.length === 1 ? 'task' : 'tasks'} • {todos.filter(t => !t.completed).length} pending
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showForm ? 'Cancel' : 'Add Task'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <TodoForm userId={userId} onClose={() => setShowForm(false)} />
          </motion.div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10 text-white">
                  <SelectItem value="all" className="text-slate-200">All Tasks</SelectItem>
                  <SelectItem value="pending" className="text-slate-200">Pending</SelectItem>
                  <SelectItem value="completed" className="text-slate-200">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[120px] bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10 text-white">
                  <SelectItem value="created_at" className="text-slate-200">Date</SelectItem>
                  <SelectItem value="priority" className="text-slate-200">Priority</SelectItem>
                  <SelectItem value="title" className="text-slate-200">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {order === 'asc' ? (
                <TrendingDown className="h-4 w-4 text-slate-400" />
              ) : (
                <TrendingUp className="h-4 w-4 text-slate-400" />
              )}
              <Select value={order} onValueChange={(value: any) => setOrder(value)}>
                <SelectTrigger className="w-[100px] bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10 text-white">
                  <SelectItem value="asc" className="text-slate-200">Asc</SelectItem>
                  <SelectItem value="desc" className="text-slate-200">Desc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleFilterChange}
              size="sm"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
            >
              Apply
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full"
            />
          </div>
        ) : searchedTodos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
            <p className="text-slate-400 mb-6">
              {todos.length === 0
                ? "Get started by creating your first task."
                : "No tasks match your current filters."}
            </p>
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first task
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {searchedTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TodoItem todo={todo} userId={userId} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;