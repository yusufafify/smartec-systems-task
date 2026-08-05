from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from .database import engine, Base
from .routers import tasks
from .exceptions import (
    sqlalchemy_exception_handler, 
    generic_exception_handler,
    task_not_found_exception_handler,
    invalid_task_operation_exception_handler,
    integrity_error_handler,
    TaskNotFoundException,
    InvalidTaskOperationException
)
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

app = FastAPI(title="Task Management API")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(TaskNotFoundException, task_not_found_exception_handler)
app.add_exception_handler(InvalidTaskOperationException, invalid_task_operation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# routers
app.include_router(tasks.router)
