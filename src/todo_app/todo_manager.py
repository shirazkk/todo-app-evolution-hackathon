"""
Todo manager for handling task operations.
"""
from typing import Optional
import uuid
from models import Task
from storage import InMemoryTaskStorage
from validation import validate_title, validate_description


class TodoManager:
    """
    Manages todo tasks with validation and storage operations.
    """
    def __init__(self):
        self.storage = InMemoryTaskStorage()

    def add_task(self, title: str, description: str = "") -> Task:
        """
        Creates a new task with validation.

        Args:
            title: The title of the task (required)
            description: The description of the task (optional)

        Returns:
            The created Task object

        Raises:
            ValueError: If validation fails
        """
        # Validate inputs
        is_valid, error_msg = validate_title(title)
        if not is_valid:
            raise ValueError(error_msg)

        is_valid, error_msg = validate_description(description)
        if not is_valid:
            raise ValueError(error_msg)

        # Generate unique ID
        task_id = str(uuid.uuid4())

        # Create and store the task
        task = Task(
            id=task_id,
            title=title.strip(),
            description=description.strip() if description else "",
            completed=False
        )

        self.storage.add_task(task)
        return task

    def get_task(self, task_id: str) -> Task:
        """
        Gets a task by its ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            The task with the specified ID
        """
        return self.storage.get_task(task_id)

    def get_all_tasks(self) -> list[Task]:
        """
        Gets all tasks.

        Returns:
            A list of all tasks
        """
        return self.storage.get_all_tasks()

    def update_task(self, task_id: str, title: Optional[str] = None,
                   description: Optional[str] = None, completed: Optional[bool] = None) -> Task:
        """
        Updates an existing task.

        Args:
            task_id: The ID of the task to update
            title: New title (optional)
            description: New description (optional)
            completed: New completion status (optional)

        Returns:
            The updated Task object
        """
        task = self.storage.get_task(task_id)

        if title is not None:
            is_valid, error_msg = validate_title(title)
            if not is_valid:
                raise ValueError(error_msg)
            task.title = title.strip()

        if description is not None:
            is_valid, error_msg = validate_description(description)
            if not is_valid:
                raise ValueError(error_msg)
            task.description = description.strip() if description else ""

        if completed is not None:
            task.completed = completed

        self.storage.update_task(task)
        return task

    def delete_task(self, task_id: str) -> None:
        """
        Deletes a task by its ID.

        Args:
            task_id: The ID of the task to delete
        """
        self.storage.delete_task(task_id)

    def mark_task_completed(self, task_id: str) -> Task:
        """
        Marks a task as completed.

        Args:
            task_id: The ID of the task to mark as completed

        Returns:
            The updated Task object
        """
        task = self.storage.get_task(task_id)
        task.completed = True
        self.storage.update_task(task)
        return task