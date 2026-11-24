import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '../enums';

export const createTaskSchema = z.object({
  eventId: z.string().optional(),
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  assigneeIds: z.array(z.string()).default([]),
  priority: z.enum(TASK_PRIORITIES).default('medium'),
  status: z.enum(TASK_STATUSES).default('todo'),
  dueAt: z.coerce.date().optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
