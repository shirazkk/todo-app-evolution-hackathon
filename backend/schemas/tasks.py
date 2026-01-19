"""
Task request/response schemas for the todo application.
"""
from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime


class TaskBase(BaseModel):
    """
    Base schema for task with common attributes.
    """
    title: str
    description: Optional[str] = None
    priority: str = "Medium"  # Default to Medium priority

    @validator('title')
    def validate_title(cls, v):
        """
        Validate task title: 1-200 characters, not just whitespace.
        """
        if not v or not v.strip():
            raise ValueError('Task title cannot be empty or contain only whitespace')
        if len(v) > 200:
            raise ValueError('Task title cannot exceed 200 characters')
        return v.strip()

    @validator('description', pre=True)
    def validate_description(cls, v):
        """
        Validate task description: max 1000 characters.
        """
        if v and len(v) > 1000:
            raise ValueError('Task description cannot exceed 1000 characters')
        return v

    @validator('priority')
    def validate_priority(cls, v):
        """
        Validate priority is one of: High, Medium, Low.
        """
        if v not in ["High", "Medium", "Low"]:
            raise ValueError('Priority must be one of: High, Medium, Low')
        return v


class TaskCreate(TaskBase):
    """
    Schema for creating a new task.
    """
    pass  # All fields inherited from TaskBase


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None

    @validator('title')
    def validate_title(cls, v):
        """
        Validate task title if provided: 1-200 characters, not just whitespace.
        """
        if v is not None:
            if not v.strip():
                raise ValueError('Task title cannot be empty or contain only whitespace')
            if len(v) > 200:
                raise ValueError('Task title cannot exceed 200 characters')
        return v.strip() if v else v

    @validator('description', pre=True)
    def validate_description(cls, v):
        """
        Validate task description if provided: max 1000 characters.
        """
        if v is not None and len(v) > 1000:
            raise ValueError('Task description cannot exceed 1000 characters')
        return v

    @validator('priority')
    def validate_priority(cls, v):
        """
        Validate priority is one of: High, Medium, Low if provided.
        """
        if v is not None and v not in ["High", "Medium", "Low"]:
            raise ValueError('Priority must be one of: High, Medium, Low')
        return v

    @validator('completed')
    def validate_completed(cls, v):
        """
        Validate completed status is boolean if provided.
        """
        if v is not None and not isinstance(v, bool):
            raise ValueError('Completed status must be a boolean')
        return v


class TaskResponse(TaskBase):
    """
    Schema for returning task data to clients.
    """
    id: str
    user_id: str
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True