"""
Todo management routes for the todo application.
"""
from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from models import Task, User
from schemas.tasks import TaskCreate, TaskUpdate, TaskResponse
from db import get_session
from utils.security import SECRET_KEY, ALGORITHM
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session
from models import User
from db import get_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user_from_token(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    """
    Get the current user from the JWT token in the Authorization header.

    Args:
        token: The JWT token from the Authorization header
        session: Database session

    Returns:
        User: The authenticated user

    Raises:
        HTTPException: If token is invalid or user doesn't exist
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Retrieve user from database
    user = session.get(User, user_id)
    if user is None:
        raise credentials_exception

    return user


router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
) -> TaskResponse:
    """
    Create a new todo task for the authenticated user.

    Args:
        task_data: Task creation data (title, description, priority)
        current_user: The authenticated user (from JWT token)
        session: Database session

    Returns:
        TaskResponse: The created task object

    Raises:
        HTTPException: If validation fails or user authentication issues
    """
    # Create new task associated with current user
    task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        user_id=current_user.id
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse.model_validate(task)


@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session),
    status_filter: str = "all",  # all, pending, completed
    priority_filter: str = "all"  # all, high, medium, low
) -> List[TaskResponse]:
    """
    Get all tasks for the authenticated user with optional filtering.

    Args:
        current_user: The authenticated user (from JWT token)
        session: Database session
        status_filter: Filter by completion status (all, pending, completed)
        priority_filter: Filter by priority (all, high, medium, low)

    Returns:
        List[TaskResponse]: List of tasks matching the user and filters
    """
    # Build query based on user and filters
    query = select(Task).where(Task.user_id == current_user.id)

    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)

    if priority_filter in ["high", "medium", "low"]:
        query = query.where(Task.priority.ilike(priority_filter))

    tasks = session.exec(query).all()

    return [TaskResponse.model_validate(task) for task in tasks]


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
) -> TaskResponse:
    """
    Get a specific task by ID.

    Args:
        task_id: The ID of the task to retrieve
        current_user: The authenticated user (from JWT token)
        session: Database session

    Returns:
        TaskResponse: The requested task object

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to user
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns the task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this task"
        )

    return TaskResponse.model_validate(task)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
) -> TaskResponse:
    """
    Update an existing task.

    Args:
        task_id: The ID of the task to update
        task_data: Task update data
        current_user: The authenticated user (from JWT token)
        session: Database session

    Returns:
        TaskResponse: The updated task object

    Raises:
        HTTPException: If task doesn't exist, doesn't belong to user, or validation fails
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns the task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this task"
        )

    # Update task fields
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.priority is not None:
        task.priority = task_data.priority

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse.model_validate(task)


@router.patch("/{task_id}/complete", response_model=TaskResponse)
def toggle_task_completion(
    task_id: str,
    completed: bool,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
) -> TaskResponse:
    """
    Toggle the completion status of a task.

    Args:
        task_id: The ID of the task to update
        completed: Whether the task should be marked as completed
        current_user: The authenticated user (from JWT token)
        session: Database session

    Returns:
        TaskResponse: The updated task object

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to user
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns the task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this task"
        )

    # Update completion status
    task.completed = completed

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
) -> None:
    """
    Delete a task.

    Args:
        task_id: The ID of the task to delete
        current_user: The authenticated user (from JWT token)
        session: Database session

    Raises:
        HTTPException: If task doesn't exist or doesn't belong to user
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify user owns the task
    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this task"
        )

    session.delete(task)
    session.commit()


# Add route to get tasks by user ID (for the URL pattern in the spec)
@router.get("/user/{user_id}", response_model=List[TaskResponse])
def get_tasks_by_user(
    user_id: str,
    current_user: User = Depends(get_current_user_from_token),
    session: Session = Depends(get_session),
    status_filter: str = "all"  # all, pending, completed
) -> List[TaskResponse]:
    """
    Get tasks for a specific user (with validation that current user matches requested user).

    Args:
        user_id: The ID of the user whose tasks to retrieve
        current_user: The authenticated user (from JWT token)
        session: Database session
        status_filter: Filter by completion status (all, pending, completed)

    Returns:
        List[TaskResponse]: List of tasks for the specified user

    Raises:
        HTTPException: If user_id doesn't match current user's ID
    """
    # Verify that requested user matches current user
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own tasks"
        )

    # Build query based on user and filters
    query = select(Task).where(Task.user_id == user_id)

    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)

    tasks = session.exec(query).all()

    return [TaskResponse.model_validate(task) for task in tasks]