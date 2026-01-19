"""
Database models for the todo application using SQLModel.
"""
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid


class UserBase(SQLModel):
    """
    Base model for user with common attributes.
    """
    email: str = Field(unique=True, index=True)
    name: str = Field(max_length=100)


class User(UserBase, table=True):
    """
    User model representing a registered user in the system.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    password_hash: str
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow,
                                sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")


class TaskBase(SQLModel):
    """
    Base model for task with common attributes.
    """
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: str = Field(default="Medium")  # High, Medium, Low
    completed: bool = Field(default=False, index=True)


class Task(TaskBase, table=True):
    """
    Task model representing a todo item in the system.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow,
                                sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to user
    user: User = Relationship(back_populates="tasks")