from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from .. import schemas, services, models, exceptions
from ..dependencies import get_db

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return services.create_task(db=db, task=task)

@router.get("/", response_model=schemas.PaginatedResponse)
def get_tasks(
    page: int = Query(1, ge=1, description="Page number"),
    pageSize: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term for title/description"),
    status: Optional[models.TaskStatus] = Query(None, description="Filter by status"),
    sort: str = Query("due_date", description="Sort field (e.g. due_date)"),
    order: str = Query("asc", description="Sort order (asc or desc)"),
    db: Session = Depends(get_db)
):
    items, total = services.get_tasks(
        db=db, page=page, page_size=pageSize, search=search, 
        status=status, sort=sort, order=order
    )
    return schemas.PaginatedResponse(items=items, total=total, page=page, page_size=pageSize)

@router.get("/{task_id}", response_model=schemas.TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = services.get_task(db, task_id=task_id)
    if task is None:
        raise exceptions.TaskNotFoundException(task_id=task_id)
    return task

@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = services.get_task(db, task_id=task_id)
    if db_task is None:
        raise exceptions.TaskNotFoundException(task_id=task_id)
    return services.update_task(db=db, db_task=db_task, task_update=task_update)

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = services.get_task(db, task_id=task_id)
    if db_task is None:
        raise exceptions.TaskNotFoundException(task_id=task_id)
    services.delete_task(db=db, db_task=db_task)
