"""
Database connection setup for the todo application.
"""
from sqlmodel import create_engine, Session
from typing import Generator
import os
from contextlib import contextmanager


# Get database URL from environment variable
# Use SQLite for local development, PostgreSQL for production
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create the database engine
if DATABASE_URL.startswith("sqlite"):
    # SQLite configuration
    engine = create_engine(
        DATABASE_URL,
        # SQLite-specific options
        connect_args={"check_same_thread": False},  # Required for SQLite with FastAPI
        echo=False  # Set to True for SQL query logging in development
    )
else:
    # PostgreSQL configuration
    engine = create_engine(
        DATABASE_URL,
        # Connection pooling options for PostgreSQL
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,  # Verify connections before use
        pool_recycle=300,    # Recycle connections after 5 minutes
        echo=False           # Set to True for SQL query logging in development
    )


def get_session() -> Generator[Session, None, None]:
    """
    Get a database session for use with FastAPI dependencies.

    Yields:
        Session: Database session for querying
    """
    with Session(engine) as session:
        yield session


@contextmanager
def get_session_context():
    """
    Context manager for database sessions when not using FastAPI dependencies.

    Yields:
        Session: Database session for querying
    """
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def init_db():
    """
    Initialize the database by creating all tables.
    This should be called when starting the application.
    """
    # Import models here to avoid circular imports
    from models import User, Task
    from sqlmodel import SQLModel

    # Create all tables defined in SQLModel models
    SQLModel.metadata.create_all(engine)


def close_db():
    """
    Close the database engine connections.
    This should be called when shutting down the application.
    """
    engine.dispose()