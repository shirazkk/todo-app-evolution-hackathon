/**
 * TodoForm component for creating and updating tasks.
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTask, updateTask } from '../lib/api';

// Define the schema for task validation
const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .transform((val) => val ?? ''),
  priority: z.enum(['High', 'Medium', 'Low'], {
    required_error: 'Priority is required',
    error_map: () => ({ message: 'Priority must be High, Medium, or Low' }),
  }),
});

type TaskFormData = z.infer<typeof taskSchema>;

/**
 * Props for the TodoForm component.
 */
interface TodoFormProps {
  userId: string;
  taskId?: string; // Optional - if provided, this is an edit form
  initialData?: Partial<TaskFormData>; // Optional - initial data for editing
  onSuccess?: () => void; // Callback when form submission is successful
}

/**
 * TodoForm component for creating and updating tasks.
 *
 * Features:
 * - Title and description input fields
 * - Priority selection (High/Medium/Low)
 * - Form validation with Zod
 * - Loading states
 * - Error handling
 */
export default function TodoForm({ userId, taskId, initialData, onSuccess }: TodoFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'Medium',
    },
  });

  /**
   * Handle form submission for creating/updating a task.
   *
   * @param data - Form data containing task details
   */
  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (taskId) {
        // Update existing task
        await updateTask(taskId, data);
      } else {
        // Create new task
        await createTask(data.title, data.description, data.priority);
      }

      // Reset form and call success callback
      reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {taskId ? 'Edit Task' : 'Add New Task'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            id="title"
            type="text"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="Task title"
            {...register('title')}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="Task description (optional)"
            {...register('description')}
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.priority ? 'border-red-300' : 'border-gray-300'
            } bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            {...register('priority')}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              reset();
              if (onSuccess) {
                onSuccess();
              }
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (taskId ? 'Updating...' : 'Creating...') : taskId ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}