import { z } from "zod";

export const TaskStatusEnum = z.enum(["Todo", "In Progress", "Done"]);
export const TaskPriorityEnum = z.enum(["Low", "Medium", "High"]);

export const TaskSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z.string().nullable().optional(),
  status: TaskStatusEnum,
  priority: TaskPriorityEnum,
  due_date: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const TaskCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z.string().nullable().optional(),
  status: TaskStatusEnum,
  priority: TaskPriorityEnum,
  due_date: z.string().nullable().optional(),
});

export const TaskUpdateSchema = TaskCreateSchema.partial();
