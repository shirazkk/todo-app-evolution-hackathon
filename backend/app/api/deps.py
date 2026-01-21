from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError
from typing import AsyncGenerator

from app.database import get_db
from app.models.user import User
from app.core.security import verify_token


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get current user from JWT token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        user_id = verify_token(credentials.credentials, credentials_exception)

        # Query the user from the database
        from sqlalchemy.future import select
        query = select(User).filter(User.id == user_id)
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if user is None:
            raise credentials_exception

        return user

    except JWTError:
        raise credentials_exception


# Actually, let's use the async version properly
async def get_db_async() -> AsyncGenerator[AsyncSession, None]:
    """
    Get async database session for dependency injection.
    """
    async with get_db() as session:
        yield session