import { Schema } from 'mongoose';
import { EVENT_TYPES, TASK_PRIORITIES, TASK_STATUSES } from '@triyugi/shared';
import { defineModel, ref, timestamps } from '../base';

const taskSchema = new Schema(
  {
    eventId: ref('Event'),
    title: { type: String, required: true },
    description: String,
    assigneeIds: [ref('User')],
    priority: { type: String, enum: TASK_PRIORITIES, default: 'medium' },
    status: { type: String, enum: TASK_STATUSES, default: 'todo' },
    dueAt: Date,
    completedAt: Date,
    checklist: [{ text: String, done: { type: Boolean, default: false }, _id: false }],
    attachments: [{ key: String, name: String, size: Number, _id: false }],
    commentCount: { type: Number, default: 0 },
    createdBy: ref('User', true),
    deletedAt: Date,
  },
  timestamps,
);
taskSchema.index({ eventId: 1, status: 1 });
taskSchema.index({ assigneeIds: 1, status: 1, dueAt: 1 });
taskSchema.index({ dueAt: 1 });
taskSchema.index({ title: 'text' });
export const Task = defineModel('Task', taskSchema, 'tasks');

const commentSchema = new Schema(
  { taskId: ref('Task', true), authorId: ref('User', true), text: { type: String, required: true } },
  timestamps,
);
commentSchema.index({ taskId: 1, createdAt: 1 });
export const TaskComment = defineModel('TaskComment', commentSchema, 'taskComments');

const checklistTemplateSchema = new Schema(
  {
    name: { type: String, required: true },
    eventType: { type: String, enum: EVENT_TYPES },
    items: [
      {
        title: String,
        offsetDays: Number,
        priority: { type: String, enum: TASK_PRIORITIES, default: 'medium' },
        _id: false,
      },
    ],
  },
  timestamps,
);
export const ChecklistTemplate = defineModel(
  'ChecklistTemplate', checklistTemplateSchema, 'checklistTemplates',
);
