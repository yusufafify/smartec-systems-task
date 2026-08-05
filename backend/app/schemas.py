from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from .models import TaskStatus, TaskPriority

class TaskBase(BaseModel):
    title: str = Field(..., max_length=100, description="Title of the task")
    description: Optional[str] = None
    status: TaskStatus
    priority: TaskPriority
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaginatedResponse(BaseModel):
    items: List[TaskResponse]
    total: int
    page: int
    page_size: int
