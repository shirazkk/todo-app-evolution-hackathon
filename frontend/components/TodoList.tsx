/**
 * TodoList component for displaying and managing tasks.
 */
'use client';

import { useState, useEffect } from 'react';
import { Task, getTasks, deleteTask, toggleTaskCompletion } from '../lib/api';

/**
 * Props for the TodoList component.
 */
interface TodoListProps {
  userId: string;
}

/**
 * TodoList component for displaying and managing tasks.
 *
 * Features:
 * - Display tasks with filtering options
 * - Mark tasks as complete/incomplete
 * - Delete tasks
 * - Loading and error states
 */
export default function TodoList({ userId }: TodoListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  /**
   * Fetch tasks from the API.
   */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const allTasks = await getTasks(filter);
        setTasks(allTasks);
      } catch (err: any) {
        setError(err.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter]);

  /**
   * Toggle task completion status.
   *
   * @param taskId - ID of the task to update
   * @param completed - New completion status
   */
  const handleToggleCompletion = async (taskId: string, completed: boolean) => {
    try {
      await toggleTaskCompletion(taskId, !completed);
      // Update the task in the local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  /**
   * Delete a task.
   *
   * @param taskId - ID of the task to delete
   */
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      // Remove the task from the local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all' filter
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 mb-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>

        {/* Filter buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'pending'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === 'completed'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks found. Add a new task to get started!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-md border ${
                task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleCompletion(task.id, task.completed)}
                  className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <p
                    className={`font-medium ${
                      task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}