from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID

class CreateTodoRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Literal['high', 'medium', 'low'] = 'medium'

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Title cannot be empty or only whitespace')
        return v.strip()


class UpdateTodoRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Literal['high', 'medium', 'low']


class PartialUpdateTodoRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Optional[Literal['high', 'medium', 'low']] = None


class ToggleCompleteRequest(BaseModel):
    completed: bool


class TodoResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    priority: str
    completed: bool
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TodoListResponse(BaseModel):
    todos: list[TodoResponse]
    total: int
    filters_applied: dict