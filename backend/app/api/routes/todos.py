from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, Literal
# from datetime import datetime
# from datetime import timezone

from app.schemas.todo import (
    CreateTodoRequest, UpdateTodoRequest, PartialUpdateTodoRequest,
    ToggleCompleteRequest, TodoResponse, TodoListResponse
)
from app.services.todo_service import (
    create_todo,
    get_user_todos,
    get_todo_by_id,
    update_todo,
    partial_update_todo,
    delete_todo,
    toggle_completion
)
from app.database import get_db
from app.api.deps import validate_user_authorization


router = APIRouter(prefix="/users/{user_id}/todos", tags=["todos"])


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo_endpoint(
    todo_data: CreateTodoRequest,
    user_id: str = Depends(validate_user_authorization),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new todo for the authenticated user.
    """
    db_todo = await create_todo(db, user_id, todo_data)
    return db_todo


@router.get("", response_model=TodoListResponse)
async def get_todos_endpoint(
    status: Optional[Literal['all', 'pending', 'completed']] = Query('all'),
    sort_by: Optional[Literal['created_at', 'priority', 'title']] = Query('created_at'),
    order: Optional[Literal['asc', 'desc']] = Query('desc'),
    user_id: str = Depends(validate_user_authorization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all todos for the authenticated user with optional filtering and sorting.
    """
    todos = await get_user_todos(db, user_id, status, sort_by, order)

    # Create response
    todo_responses = [TodoResponse.model_validate(todo) for todo in todos]
    response = TodoListResponse(
        todos=todo_responses,
        total=len(todos),
        filters_applied={
            "status": status,
            "sort_by": sort_by,
            "order": order
        }
    )

    return response


@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo_endpoint(
    todo_id: str,
    user_id: str = Depends(validate_user_authorization),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific todo by ID for the authenticated user.
    """
    todo = await get_todo_by_id(db, todo_id, user_id)
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return todo


@router.put("/{todo_id}", response_model=TodoResponse)
async def update_todo_endpoint(
    todo_id: str,
    todo_data: UpdateTodoRequest,
    user_id: str = Depends(validate_user_authorization),
    db: AsyncSession = Depends(get_db)
):
    """
    Update a todo by ID for the authenticated user.
    """
    updated_todo = await update_todo(db, todo_id, user_id, todo_data)
    if not updated_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return updated_todo


@router.patch("/{todo_id}", response_model=TodoResponse)
async def partial_update_todo_endpoint(
    todo_id: str,
    todo_data: PartialUpdateTodoRequest,
    user_id: str = Depends(validate_user_authorization),
    db: AsyncSession = Depends(get_db)
):
    """
    Partially update a todo by ID for the authenticated user.
    """
    updated_todo = await partial_update_todo(db, todo_id, user_id, todo_data)
    if not updated_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return updated_todo


@router.patch("/{todo_id}/complete", response_model=TodoResponse)
async def toggle_complete_endpoint(
    todo_id: str,
    completion_data: ToggleCompleteRequest,
    user_id: str = Depends(validate_user_authorization),
    db: AsyncSession = Depends(get_db)
):
    """
    Toggle the completion status of a todo for the authenticated user.
    """
    updated_todo = await toggle_completion(db, todo_id, user_id, completion_data.completed)
    if not updated_todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return updated_todo


@router.delete("/{todo_id}", status_code=status.HTTP_200_OK)
async def delete_todo_endpoint(
    todo_id: str,
    user_id: str = Depends(validate_user_authorization),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a todo by ID for the authenticated user.
    """
    success = await delete_todo(db, todo_id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return {"message": "Todo deleted successfully", "deleted_id": todo_id}