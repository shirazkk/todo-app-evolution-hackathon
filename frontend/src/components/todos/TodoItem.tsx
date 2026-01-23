import React from 'react';
import { Todo } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2Icon, EditIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  isToggling: boolean;
  isDeleting: boolean;
}

const TodoItem = ({ todo, onToggle, onDelete, isToggling, isDeleting }: TodoItemProps) => {
  const router = useRouter();

  const handleToggle = () => {
    onToggle(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    router.push(`/dashboard/edit/${todo.id}`);
  };

  return (
    <Card>
      <CardContent className="p-4 flex items-start space-x-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={isToggling}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            Created: {new Date(todo.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            disabled={isDeleting}
            aria-label="Edit todo"
          >
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete todo"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;