import sys
import os

# Ensure the app module can be imported when running as a standalone script
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base
from app.models import Task

def init_db():
    print("Creating database tables and schemas...")
    Base.metadata.create_all(bind=engine)
    print("Success! Database tables are ready.")

if __name__ == "__main__":
    init_db()
