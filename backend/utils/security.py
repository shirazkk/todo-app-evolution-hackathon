"""
Security utilities for the todo application including password hashing and JWT handling.
"""
from datetime import datetime, timedelta
from typing import Optional
import os
import uuid
from passlib.context import CryptContext
from jose import JWTError, jwt


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-jwt-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days (7*24*60 minutes)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hashed version.

    Args:
        plain_password: The plain text password to verify
        hashed_password: The hashed password to compare against

    Returns:
        True if the password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Generate a hash for the given password.

    Args:
        password: The plain text password to hash

    Returns:
        The hashed password
    """
    return pwd_context.hash(password, rounds=12)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.

    Args:
        data: The data to include in the token payload
        expires_delta: Optional expiration time delta (defaults to 7 days)

    Returns:
        The encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "jti": str(uuid.uuid4())})  # Add token ID for potential revocation

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """
    Verify a JWT token and return the payload if valid.

    Args:
        token: The JWT token to verify

    Returns:
        The token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def decode_token_payload(token: str) -> Optional[dict]:
    """
    Decode a JWT token to get its payload without verification.
    Use this only for non-sensitive operations like extracting user info.

    Args:
        token: The JWT token to decode

    Returns:
        The token payload if decoding successful, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_signature": False})
        return payload
    except JWTError:
        return None


def create_user_token(user_id: str) -> str:
    """
    Create a JWT token specifically for a user.

    Args:
        user_id: The ID of the user to create the token for

    Returns:
        The encoded JWT token
    """
    data = {"sub": user_id, "type": "access"}
    return create_access_token(data)