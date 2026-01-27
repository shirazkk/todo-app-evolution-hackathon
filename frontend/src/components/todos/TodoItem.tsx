'use client';

import { useState } from 'react';
import { useTodosContext } from '../../context/TodosContext';
import { TodoItem as TodoItemType } from '../../types/todos';

interface TodoItemProps {
  todo: TodoItemType;
  userId: string;
}

const TodoItem = ({ todo, userId }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { updateTodo, toggleTodoCompletion, deleteTodo } = useTodosContext();

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleTodoCompletion(userId, todo.id);
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await deleteTodo(userId, todo.id);
      } catch (err: any) {
        setError(err.message || 'Failed to delete todo');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateTodo(userId, todo.id, {
        title: editTitle,
        description: editDescription || undefined,
        priority: editPriority,
      });

      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border p-5 transition-all duration-200 ${
        todo.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
      }`}
      role="article"
      aria-labelledby={`todo-title-${todo.id}`}
    >
      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="space-y-3">
          {error && (
            <div
              className="p-2 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <input
            type="text"
            id={`edit-title-${todo.id}`}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
            required
            aria-label="Edit task title"
            autoFocus
          />

          <textarea
            id={`edit-description-${todo.id}`}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
            aria-label="Edit task description"
          />

          <div className="flex items-center justify-between">
            <label htmlFor={`edit-priority-${todo.id}`} className="sr-only">Priority</label>
            <select
              id={`edit-priority-${todo.id}`}
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as 'high' | 'medium' | 'low')}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white focus:outline-none"
              aria-label="Select task priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Save changes"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <>
          {error && (
            <div
              className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-start">
            <input
              type="checkbox"
              id={`toggle-completion-${todo.id}`}
              checked={todo.completed}
              onChange={handleToggle}
              disabled={loading}
              className="mt-1 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 focus:outline-none"
              aria-describedby={`todo-desc-${todo.id}`}
              aria-label={`Mark task "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
            />

            <div className="ml-3 flex-1 min-w-0">
              <h3
                id={`todo-title-${todo.id}`}
                className={`text-lg font-medium ${
                  todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}
                tabIndex={0}
              >
                {todo.title}
              </h3>

              {todo.description && (
                <p
                  id={`todo-desc-${todo.id}`}
                  className={`mt-1 text-gray-600 ${
                    todo.completed ? 'text-gray-400' : ''
                  }`}
                >
                  {todo.description}
                </p>
              )}

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      todo.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : todo.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                    aria-label={`Priority: ${todo.priority}`}
                  >
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                  </span>

                  <span className="text-xs text-gray-500" aria-label={`Created on ${formatDate(todo.created_at)}`}>
                    Created: {formatDate(todo.created_at)}
                  </span>

                  {todo.completed && todo.completed_at && (
                    <span className="text-xs text-gray-500" aria-label={`Completed on ${formatDate(todo.completed_at)}`}>
                      Completed: {formatDate(todo.completed_at)}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2" role="group" aria-label="Task actions">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                    title="Edit task"
                    aria-label={`Edit task "${todo.title}"`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                    title="Delete task"
                    aria-label={`Delete task "${todo.title}"`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;