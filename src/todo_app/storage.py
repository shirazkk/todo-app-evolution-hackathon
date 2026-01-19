"""
In-memory task storage for the todo application.
"""
from typing import Dict, List
from models import Task


class InMemoryTaskStorage:
    """
    A simple in-memory storage for tasks.
    """
    def __init__(self):
        self._tasks: Dict[str, Task] = {}

    def add_task(self, task: Task) -> None:
        """
        Adds a task to the storage.

        Args:
            task: The task to add
        """
        self._tasks[task.id] = task

    def get_task(self, task_id: str) -> Task:
        """
        Gets a task by its ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The task with the specified ID

        Raises:
            KeyError: If no task with the given ID exists
        """
        if task_id not in self._tasks:
            raise KeyError(f"No task with ID {task_id}")
        return self._tasks[task_id]

    def get_all_tasks(self) -> List[Task]:
        """
        Gets all tasks in the storage.

        Returns:
            A list of all tasks
        """
        return list(self._tasks.values())

    def update_task(self, task: Task) -> None:
        """
        Updates an existing task in the storage.

        Args:
            task: The task with updated information
        """
        if task.id not in self._tasks:
            raise KeyError(f"No task with ID {task.id}")
        self._tasks[task.id] = task

    def delete_task(self, task_id: str) -> None:
        """
        Deletes a task by its ID.

        Args:
            task_id: The ID of the task to delete

        Raises:
            KeyError: If no task with the given ID exists
        """
        if task_id not in self._tasks:
            raise KeyError(f"No task with ID {task_id}")
        del self._tasks[task_id]