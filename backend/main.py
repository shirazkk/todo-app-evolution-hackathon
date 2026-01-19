"""
Main application file for the todo application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, tasks
from db import init_db


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.

    Returns:
        FastAPI: Configured application instance
    """
    app = FastAPI(
        title="Todo Application API",
        description="API for the todo application with user authentication and task management",
        version="1.0.0"
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify actual origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth.router, prefix="/api")
    app.include_router(tasks.router, prefix="/api")

    # Initialize database
    @app.on_event("startup")
    def startup_event():
        init_db()

    # Health check endpoint
    @app.get("/health")
    def health_check():
        return {"status": "healthy", "service": "todo-api"}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)