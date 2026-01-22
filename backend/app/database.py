from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.asyncio import async_sessionmaker


Base = declarative_base()

# Create engine and sessionmaker separately to avoid circular imports
def get_engine():
    """Get the database engine, initializing it if needed."""
    from .config import settings

    # Create async engine with PostgreSQL-specific settings
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=True,  # Set to False in production
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=20,
        max_overflow=10,
        connect_args={
            "server_settings": {
                "application_name": "todo-api",
            },
        }
    )
    return engine


def get_async_session():
    """Get the async session maker."""
    engine = get_engine()
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    return async_session


async def get_db():
    """Get database session for dependency injection."""
    async_session = get_async_session()
    async with async_session() as session:
        yield session

