from sqlalchemy.orm import Session
from sqlalchemy import or_, asc, desc
from typing import Optional
from .models import Task, TaskStatus
from .schemas import TaskCreate, TaskUpdate

def create_task(db: Session, task: TaskCreate):
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_task(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()

def update_task(db: Session, db_task: Task, task_update: TaskUpdate):
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, db_task: Task):
    db.delete(db_task)
    db.commit()

def get_tasks(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    search: Optional[str] = None,
    status: Optional[TaskStatus] = None,
    sort: str = "created_at",
    order: str = "desc"
):
    query = db.query(Task)
    
    # Filtering
    if search:
        query = query.filter(or_(
            Task.title.ilike(f"%{search}%"),
            Task.description.ilike(f"%{search}%")
        ))
    if status:
        query = query.filter(Task.status == status)
        
    # Sorting
    sort_column = getattr(Task, sort, Task.created_at)
    if order.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))
        
    # Pagination
    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    
    return items, total
