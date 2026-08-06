# Task Management System

A full-stack Task Management System built with React, TypeScript, FastAPI, and PostgreSQL.
*(Side note: The code is also optimized to handle SQLite for local testing or smaller deployments).*

## Features

- **Task Management**: Create, read, update, and delete tasks.
- **Search & Filtering**: Search tasks by title or description. Filter by status (Todo, In Progress, Done).
- **Pagination & Sorting**: Built-in pagination and sorting by due date or other fields.
- **Responsive UI**: Built with modern, clean UI components.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui.
- **Backend**: Python, FastAPI, SQLAlchemy, Alembic (for database migrations).
- **Database**: PostgreSQL

## Installation & Setup

### Prerequisites

- Node.js (v18+)
- Python (3.9+)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   Copy `.env.example` to `.env` and update the `DATABASE_URI` to point to your PostgreSQL instance.
   *(Side note: The code is also optimized to handle SQLite. You can use `DATABASE_URI=sqlite:///./tasks.db` for quick local testing).*
5. Run database migrations to create the tables:
   ```bash
   alembic upgrade head
   ```
6. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and set the backend URL (if different from default):
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:5173`.

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Project Structure

```text
├── backend/
│   ├── app/           # FastAPI application (routers, services, models, schemas)
│   └── migration/     # Alembic database migrations
└── frontend/
    └── src/
        ├── features/  # Feature-based React components (Task table, dialogs)
        ├── hooks/     # Custom React hooks for data fetching
        └── service/   # API client and type definitions
```

## Design Decisions & Architecture

- **Backend:** Chose **FastAPI** for its incredible speed, automatic Swagger documentation generation, and built-in type validation via Pydantic. It provides an excellent developer experience while maintaining production-grade performance.
- **Frontend:** Used **Vite** for rapid local development and hot module replacement. Components are structured by "feature" (e.g., `features/tasks`) rather than purely by file type to maximize scalability and maintainability. 
- **State Management:** Delegated API data fetching and state logic to a custom hook (`useTasks.ts`). This ensures a clean separation of concerns, keeping the UI components strictly focused on presentation.
