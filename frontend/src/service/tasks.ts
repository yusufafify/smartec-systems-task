import { api } from "@/lib/fetch_instance/api-client";
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  PaginatedTasks,
  TaskStatus,
} from "@/types/task";

export interface GetTasksParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: TaskStatus;
  sort?: string;
  order?: "asc" | "desc";
}

export const getTasks = async (
  params?: GetTasksParams,
): Promise<PaginatedTasks> => {
  const validParams: Record<string, string | number | boolean> = {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        validParams[key] = value as string | number | boolean;
      }
    });
  }

  return api.get<PaginatedTasks>("/tasks/", { params: validParams });
};

export const getTask = async (taskId: number): Promise<Task> => {
  return api.get<Task>(`/tasks/${taskId}`);
};

export const createTask = async (task: TaskCreate): Promise<Task> => {
  return api.post<Task>("/tasks/", { data: task });
};

export const updateTask = async (
  taskId: number,
  taskUpdate: TaskUpdate,
): Promise<Task> => {
  return api.put<Task>(`/tasks/${taskId}`, { data: taskUpdate });
};

export const deleteTask = async (taskId: number): Promise<void> => {
  return api.delete<void>(`/tasks/${taskId}`);
};
