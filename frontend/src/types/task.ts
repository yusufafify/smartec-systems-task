import { z } from "zod";
import {
  TaskStatusEnum,
  TaskPriorityEnum,
  TaskSchema,
  TaskCreateSchema,
  TaskUpdateSchema,
} from "@/schemas/task";

export type TaskStatus = z.infer<typeof TaskStatusEnum>;
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;
export type Task = z.infer<typeof TaskSchema>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;

export interface PaginatedTasks {
  items: Task[];
  total: number;
  page: number;
  page_size: number;
}
