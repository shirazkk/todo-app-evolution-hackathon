import sys
import os
from pathlib import Path
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import declarative_base

from alembic import context

# Add the project root to the path so we can import our models
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    # Try to import from the actual app structure
    from app.database import Base
    # Import models to register them with Base
    # from app.models.user import User
    # from app.models.todo import Todo
    # from app.models.session import Session
except ImportError as e:
    print(f"Import error: {e}")
    # Fallback to defining Base for migration generation only
    Base = declarative_base()

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    if url is None:
        # Attempt to get the database URL from our settings
        try:
            from app.config import settings
            url = settings.DATABASE_URL
        except:
            # Fallback to a default URL for offline generation
            url = "postgresql+asyncpg://user:password@localhost/dbname"

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""

    # For online migrations, get the database URL from our settings or environment
    try:
        from app.config import settings
        database_url = settings.DATABASE_URL
    except:
        # Fallback to environment variable
        database_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/dbname")

    # Update the configuration dictionary
    configuration = config.get_section(config.config_ini_section)
    if configuration is None:
        configuration = {}
    configuration["sqlalchemy.url"] = database_url

    # Import create_async_engine here to ensure it's available
    from sqlalchemy.ext.asyncio import create_async_engine

    connectable = create_async_engine(
        database_url,
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)


def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    import asyncio
    asyncio.run(run_migrations_online())