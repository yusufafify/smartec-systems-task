from sqlalchemy import Column, Integer, String, Enum as SQLEnum, DateTime
from sqlalchemy.sql import func
import enum
from .database import Base

class TaskStatus(str, enum.Enum):
    TODO = "Todo"
    IN_PROGRESS = "In Progress"
    DONE = "Done"

class TaskPriority(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False, index=True)
    description = Column(String, nullable=True)
    status = Column(SQLEnum(TaskStatus), nullable=False)
    priority = Column(SQLEnum(TaskPriority), nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
