'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useTodos } from '@/hooks/useApiCache';
import { useRouter } from 'next/navigation';

// Define todo form schema with Zod
const todoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable(),
  completed: z.boolean().default(false),
});

// Define type for form data
type TodoFormValues = z.infer<typeof todoSchema>;

interface TodoFormProps {
  initialData?: Partial<TodoFormValues>;
  isEditing?: boolean;
  todoId?: string;
}

const TodoForm = ({ initialData, isEditing = false }: TodoFormProps) => {
  const { createTodo, updateTodo, isCreating, isUpdating } = useTodos();
  const router = useRouter();

  // Set up form with react-hook-form and Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      completed: initialData?.completed || false,
    },
  });

  // Handle form submission
  const onSubmit = async (data: TodoFormValues) => {
    try {
      if (isEditing) {
        // For now, we'll just redirect to the dashboard for editing
        // The actual update logic would be implemented in the dashboard page
        router.push('/dashboard');
      } else {
        await createTodo(data.title, data.description || undefined, data.completed);
        // Redirect to dashboard after successful creation
        router.push('/dashboard');
        router.refresh(); // Refresh to update the UI with the new todo
      }
    } catch (err: any) {
      // Set error to display in the form
      setError('root', {
        type: 'manual',
        message: err?.response?.data?.detail || 'Failed to save todo. Please try again.',
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Todo' : 'Create New Todo'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update your todo item here.'
            : 'Add a new todo item to your list.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              placeholder="Enter todo title"
              {...register('title')}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter todo description (optional)"
              {...register('description')}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Completed Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              {...register('completed')}
              disabled={isSubmitting}
            />
            <label htmlFor="completed" className="text-sm font-medium">
              Mark as completed
            </label>
          </div>

          {/* Error Message */}
          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {errors.root.message}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditing ? (
              'Update Todo'
            ) : (
              'Create Todo'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TodoForm;