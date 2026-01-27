'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTodosContext } from '@/context/TodosContext';
import { TodoItem as TodoItemType } from '@/types/todos';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Check,
  Square,
  Edit3,
  Trash2,
  Calendar,
  Flag,
  RotateCcw
} from 'lucide-react';

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
      setError(err.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTodo(userId, todo.id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setLoading(false);
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
      setError(err.message || 'Failed to update task');
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-300 group"
    >
      {isEditing ? (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSaveEdit}
          className="space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            required
            autoFocus
          />

          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Add a description..."
          />

          <div className="flex items-center justify-between pt-2">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as 'high' | 'medium' | 'low')}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="low" className="bg-slate-800">Low</option>
              <option value="medium" className="bg-slate-800">Medium</option>
              <option value="high" className="bg-slate-800">High</option>
            </select>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="border-white/20 text-slate-300 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </motion.form>
      ) : (
        <div className="flex items-start gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            disabled={loading}
            className={`p-2 rounded-full border-2 flex-shrink-0 ${
              todo.completed
                ? 'bg-gradient-to-r from-green-500 to-teal-600 border-green-500/50 text-white'
                : 'border-white/30 hover:border-cyan-400/50 hover:bg-cyan-500/10'
            }`}
            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {todo.completed ? (
              <Check className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </motion.button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    todo.completed
                      ? 'text-slate-500 line-through'
                      : 'text-white group-hover:text-slate-100'
                  }`}
                >
                  {todo.title}
                </h3>

                {todo.description && (
                  <p className={`mt-2 text-slate-400 ${todo.completed ? 'line-through' : ''}`}>
                    {todo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`text-xs capitalize ${
                    todo.priority === 'high'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
                      : todo.priority === 'medium'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                      : 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
                  }`}
                >
                  <Flag className="h-3 w-3 mr-1" />
                  {todo.priority}
                </Badge>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(todo.created_at)}</span>
                </div>

                {todo.completed && todo.completed_at && (
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    <span>Completed: {formatDate(todo.completed_at)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                  aria-label="Edit task"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={loading}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border border-white/20">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg font-semibold text-white">
                        Are you sure you want to delete this task?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        This action cannot be undone. This will permanently delete the task "{todo.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-white/20 text-slate-300 hover:bg-white/10">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TodoItem;