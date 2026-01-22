from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
from typing import Optional
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token
from app.schemas.auth import SignupRequest
from app.config import settings


async def create_user(db: AsyncSession, signup_data: SignupRequest) -> User:
    """
    Create a new user with hashed password.
    """
    # Check if user with this email already exists
    existing_user_query = select(User).where(User.email == signup_data.email)
    existing_user_result = await db.execute(existing_user_query)
    existing_user = existing_user_result.scalar_one_or_none()

    if existing_user:
        raise ValueError("Email already registered")

    # Create new user
    hashed_password = get_password_hash(signup_data.password)
    db_user = User(
        email=signup_data.email,
        password_hash=hashed_password,
        name=signup_data.name
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    return db_user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
    """
    Authenticate user by email and password.
    """
    query = select(User).where(User.email == email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user or not verify_password(password, user.password_hash):
        return None

    return user





def create_auth_token(user_id: str) -> str:
    """
    Create authentication token for the user.
    """
    access_token_expires = timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)
    token_data = {"sub": user_id}
    token = create_access_token(data=token_data, expires_delta=access_token_expires)
    return token