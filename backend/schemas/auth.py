"""
Authentication request/response schemas using Pydantic models.
"""
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


class SignupRequest(BaseModel):
    """
    Request model for user signup.
    """
    email: EmailStr
    password: str
    name: str

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """
        Validate password strength: at least 8 chars with 1 uppercase, 1 lowercase, 1 number.
        """
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        return v

    @field_validator('name')
    @classmethod
    def validate_name_length(cls, v: str) -> str:
        """
        Validate name length: between 2 and 100 characters.
        """
        if len(v) < 2 or len(v) > 100:
            raise ValueError('Name must be between 2 and 100 characters')
        return v


class LoginRequest(BaseModel):
    """
    Request model for user login.
    """
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """
    Response model for authentication tokens.
    """
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """
    Data model for JWT token payload.
    """
    user_id: str
    username: Optional[str] = None
    exp: Optional[datetime] = None