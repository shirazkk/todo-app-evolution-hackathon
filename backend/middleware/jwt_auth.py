"""
JWT authentication middleware for the todo application.
"""
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlmodel import Session
from typing import Optional
from models import User
from db import get_session
from utils.security import SECRET_KEY, ALGORITHM


# HTTP Bearer scheme for token extraction
security = HTTPBearer()


def get_current_user_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """
    Get the current user from the JWT token in the Authorization header.

    Args:
        credentials: The HTTP authorization credentials (token)
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
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Retrieve user from database
    user = session.get(User, user_id)
    if user is None:
        raise credentials_exception

    return user


def verify_user_owns_resource(
    user: User = Depends(get_current_user_from_token),
    resource_user_id: str = None
) -> bool:
    """
    Verify that the authenticated user owns the resource they're trying to access.

    Args:
        user: The authenticated user
        resource_user_id: The ID of the user who owns the resource

    Returns:
        bool: True if user owns the resource, raises HTTPException otherwise

    Raises:
        HTTPException: If user doesn't own the resource
    """
    if user.id != resource_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this resource"
        )
    return True