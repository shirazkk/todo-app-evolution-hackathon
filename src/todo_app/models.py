from dataclasses import dataclass
from typing import Optional
import uuid


@dataclass
class Task:
    """
    Represents a single todo task with unique ID, title, description, and completion status.
    """
    id: str
    title: str
    description: Optional[str] = ""
    completed: bool = False

    def __post_init__(self):
        """
        Validates the task data after initialization.
        """
        if not self.id:
            raise ValueError("Task ID cannot be empty")
        if not self.title.strip():
            raise ValueError("Task title cannot be empty or contain only whitespace")
        if len(self.title) > 200:
            raise ValueError("Task title cannot exceed 200 characters")
        if self.description and len(self.description) > 1000:
            raise ValueError("Task description cannot exceed 1000 characters")