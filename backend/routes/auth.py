"""
Authentication routes for the todo application.
"""
from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
import re
from models import User
from schemas.auth import SignupRequest, LoginRequest, TokenResponse
from utils.security import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM
from db import get_session
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt


router = APIRouter(prefix="/auth", tags=["Authentication"])

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# Dependency to get current user from token
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


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(
    signup_data: SignupRequest,
    session: Session = Depends(get_session)
) -> TokenResponse:
    """
    Register a new user with email, password, and name.

    Args:
        signup_data: User registration data (email, password, name)
        session: Database session

    Returns:
        TokenResponse: JWT access token

    Raises:
        HTTPException: If email is invalid format, password is weak, or email already exists
    """
    # Validate email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, signup_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )

    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == signup_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create new user
    user = User(
        email=signup_data.email,
        name=signup_data.name,
        password_hash=get_password_hash(signup_data.password)
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Create and return access token
    access_token_data = {"sub": str(user.id)}
    access_token = create_access_token(
        data=access_token_data,
        expires_delta=timedelta(days=7)  # Token valid for 7 days
    )
    return TokenResponse(access_token=access_token, token_type="bearer")


@router.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    session: Session = Depends(get_session)
) -> TokenResponse:
    """
    Authenticate user with email and password.

    Args:
        login_data: User login data (email, password)
        session: Database session

    Returns:
        TokenResponse: JWT access token

    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email
    user = session.exec(select(User).where(User.email == login_data.email)).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create and return access token
    access_token_data = {"sub": str(user.id)}
    access_token = create_access_token(
        data=access_token_data,
        expires_delta=timedelta(days=7)  # Token valid for 7 days
    )
    return TokenResponse(access_token=access_token, token_type="bearer")


@router.post("/logout")
def logout():
    """
    Logout user (currently just a placeholder - actual token invalidation would happen on client side).
    """
    return {"message": "Successfully logged out"}


@router.get("/me")
def get_current_user(
    current_user: User = Depends(get_current_user_from_token)
):
    """
    Get current user's information based on their JWT token.

    Args:
        current_user: The authenticated user (retrieved from token)

    Returns:
        User information (email, name)
    """
    return {"email": current_user.email, "name": current_user.name}