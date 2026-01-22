from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    API_V1_PREFIX: str = "/api"
    PROJECT_NAME: str = "Todo API"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8000"
    RATE_LIMIT_PER_MINUTE: int = 5
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        extra = "allow"  # Allow extra fields to prevent errors


# Initialize settings with fallback for development
def get_settings():
    try:
        return Settings()
    except Exception:
        # Provide defaults in case .env file is missing during development
        os.environ.setdefault('DATABASE_URL', 'your_default_dev_database_url')
        os.environ.setdefault('SECRET_KEY', 'dev-secret-key-change-in-production')
        return Settings()


settings = get_settings()