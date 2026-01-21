from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from datetime import timezone

from app.schemas.auth import SignupRequest, LoginRequest, AuthResponse
from app.services.auth_service import create_user, authenticate_user, create_auth_token
from app.database import get_db
from app.models.user import User
from app.api.deps import get_current_user


router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(signup_data: SignupRequest, db: AsyncSession = Depends(get_db)):
    """
    Register a new user.
    """
    try:
        # Create the user
        db_user = await create_user(db=db, signup_data=signup_data)

        # Create access token
        token = create_auth_token(str(db_user.id))

        # Calculate expiry date
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)  # 7 days as per settings

        # Create response
        auth_response = AuthResponse(
            user={
                "id": str(db_user.id),
                "email": db_user.email,
                "name": db_user.name,
                "created_at": db_user.created_at
            },
            token=token,
            expires_at=expires_at
        )

        return auth_response

    except ValueError as e:
        # Handle case where email is already registered
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during registration: {str(e)}"
        )


@router.post("/login", response_model=AuthResponse)
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticate user and return access token.
    """
    user = await authenticate_user(
        db=db,
        email=login_data.email,
        password=login_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create access token
    token = create_auth_token(str(user.id))

    # Calculate expiry date
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)  # 7 days as per settings

    # Create response
    auth_response = AuthResponse(
        user={
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "created_at": user.created_at
        },
        token=token,
        expires_at=expires_at
    )

    return auth_response


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout():
    """
    Logout endpoint - in stateless JWT, client should just delete the token.
    """
    return {"message": "Successfully logged out"}


@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current user info.
    """
    return current_user