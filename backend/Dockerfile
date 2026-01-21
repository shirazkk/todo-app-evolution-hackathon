FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy project dependencies
COPY pyproject.toml .

# Install uv and project dependencies
RUN pip install uv && uv pip install --system --system-site-packages -e .

# Copy project source
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]