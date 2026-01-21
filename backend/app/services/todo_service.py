from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, desc, asc
from typing import Optional, List
from datetime import datetime
from datetime import timezone

from app.models.todo import Todo
from app.models.user import User
from app.schemas.todo import CreateTodoRequest, UpdateTodoRequest, PartialUpdateTodoRequest, ToggleCompleteRequest


async def create_todo(
    db: AsyncSession,
    user_id: str,
    todo_data: CreateTodoRequest
) -> Todo:
    """
    Create a new todo for the specified user.
    """
    db_todo = Todo(
        user_id=user_id,
        title=todo_data.title,
        description=todo_data.description,
        priority=todo_data.priority
    )

    db.add(db_todo)
    await db.commit()
    await db.refresh(db_todo)

    return db_todo


async def get_user_todos(
    db: AsyncSession,
    user_id: str,
    status: Optional[str] = None,
    sort_by: str = "created_at",
    order: str = "desc"
) -> List[Todo]:
    """
    Get all todos for a specific user with optional filtering and sorting.
    """
    query = select(Todo).where(Todo.user_id == user_id)

    # Apply status filter if provided
    if status == "completed":
        query = query.where(Todo.completed == True)
    elif status == "pending":
        query = query.where(Todo.completed == False)

    # Apply sorting
    if sort_by == "created_at":
        sort_column = Todo.created_at
    elif sort_by == "priority":
        sort_column = Todo.priority
    elif sort_by == "title":
        sort_column = Todo.title
    else:
        sort_column = Todo.created_at

    if order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    result = await db.execute(query)
    todos = result.scalars().all()

    return list(todos)


async def get_todo_by_id(
    db: AsyncSession,
    todo_id: str,
    user_id: str
) -> Optional[Todo]:
    """
    Get a specific todo by ID for the specified user.
    """
    query = select(Todo).where(
        and_(Todo.id == todo_id, Todo.user_id == user_id)
    )
    result = await db.execute(query)
    todo = result.scalar_one_or_none()

    return todo


async def update_todo(
    db: AsyncSession,
    todo_id: str,
    user_id: str,
    todo_data: UpdateTodoRequest
) -> Optional[Todo]:
    """
    Update a todo with new data.
    """
    todo = await get_todo_by_id(db, todo_id, user_id)
    if not todo:
        return None

    # Update all fields
    todo.title = todo_data.title
    todo.description = todo_data.description
    todo.priority = todo_data.priority
    todo.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(todo)

    return todo


async def partial_update_todo(
    db: AsyncSession,
    todo_id: str,
    user_id: str,
    todo_data: PartialUpdateTodoRequest
) -> Optional[Todo]:
    """
    Partially update a todo with provided fields only.
    """
    todo = await get_todo_by_id(db, todo_id, user_id)
    if not todo:
        return None

    # Update only provided fields
    if todo_data.title is not None:
        todo.title = todo_data.title
    if todo_data.description is not None:
        todo.description = todo_data.description
    if todo_data.priority is not None:
        todo.priority = todo_data.priority

    todo.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(todo)

    return todo


async def delete_todo(
    db: AsyncSession,
    todo_id: str,
    user_id: str
) -> bool:
    """
    Delete a todo by ID for the specified user.
    """
    todo = await get_todo_by_id(db, todo_id, user_id)
    if not todo:
        return False

    await db.delete(todo)
    await db.commit()

    return True


async def toggle_completion(
    db: AsyncSession,
    todo_id: str,
    user_id: str,
    completed: bool
) -> Optional[Todo]:
    """
    Toggle the completion status of a todo.
    """
    todo = await get_todo_by_id(db, todo_id, user_id)
    if not todo:
        return None

    todo.completed = completed
    todo.updated_at = datetime.now(timezone.utc)

    if completed:
        todo.completed_at = datetime.now(timezone.utc)
    else:
        todo.completed_at = None

    await db.commit()
    await db.refresh(todo)

    return todo