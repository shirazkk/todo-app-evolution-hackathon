from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings


app = FastAPI(title=settings.PROJECT_NAME)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routes
try:
    from app.api.routes import auth, todos
    app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
    app.include_router(todos.router, prefix=settings.API_V1_PREFIX)
except ImportError:
    # For development/testing when routes might not be fully implemented
    pass


@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    from fastapi.encoders import jsonable_encoder
    return JSONResponse(
        status_code=400,
        content={
            "error": "Validation Error",
            "details": jsonable_encoder(exc.errors())
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    # Log error
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error"}
    )


@app.middleware("http")
async def log_requests(request: Request, call_next):
    import time
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    print(f"{request.method} {request.url.path} "
          f"completed in {duration:.2f}s with status {response.status_code}")
    return response


@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


