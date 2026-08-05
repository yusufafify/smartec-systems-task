import { useState, useEffect, useCallback } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "@/service/tasks";
import type { GetTasksParams } from "@/service/tasks";
import type { PaginatedTasks, TaskCreate, TaskUpdate } from "@/types/task";
import { toast } from "sonner";

export function useTasks(initialParams?: GetTasksParams) {
  const [tasksData, setTasksData] = useState<PaginatedTasks | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetTasksParams>(initialParams || { page: 1, pageSize: 10 });

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTasks(params);
      setTasksData(data);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch tasks");
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchTasks();
  }, [fetchTasks]);

  const updateParams = (newParams: Partial<GetTasksParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      // Reset to page 1 when search or filter changes, unless page is explicitly being set
      page: newParams.page ?? (newParams.search !== undefined || newParams.status !== undefined ? 1 : prev.page),
    }));
  };

  const handleCreateTask = async (task: TaskCreate) => {
    try {
      await createTask(task);
      toast.success("Task created successfully");
      fetchTasks();
      return true;
    } catch (err) {
      toast.error((err as Error).message || "Failed to create task");
      return false;
    }
  };

  const handleUpdateTask = async (taskId: number, task: TaskUpdate) => {
    try {
      await updateTask(taskId, task);
      toast.success("Task updated successfully");
      fetchTasks();
      return true;
    } catch (err) {
      toast.error((err as Error).message || "Failed to update task");
      return false;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
      fetchTasks();
      return true;
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete task");
      return false;
    }
  };

  return {
    tasksData,
    isLoading,
    error,
    params,
    updateParams,
    fetchTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask
  };
}
