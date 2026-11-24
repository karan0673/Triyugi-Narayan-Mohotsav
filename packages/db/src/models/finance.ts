import { Schema } from 'mongoose';
import { PAYMENT_MODES, PAYMENT_TYPES, SHAGUN_KINDS } from '@triyugi/shared';
import { defineModel, ref, timestamps } from '../base';

const budgetSchema = new Schema(
  {
    eventId: ref('Event'),
    category: { type: String, required: true, trim: true },
    categoryKey: { type: String, required: true }, // set by the API via toCategoryKey()
    amountPaise: { type: Number, required: true, min: 0 },
  },
  timestamps,
);
budgetSchema.index({ eventId: 1, categoryKey: 1 }, { unique: true });
export const Budget = defineModel('Budget', budgetSchema, 'budgets');

const expenseSchema = new Schema(
  {
    eventId: ref('Event'),
    category: { type: String, required: true, trim: true },
    categoryKey: { type: String, required: true },
    title: { type: String, required: true },
    amountPaise: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
    vendorId: ref('Vendor'),
    payee: String,
    paymentMode: { type: String, enum: PAYMENT_MODES, default: 'cash' },
    paymentType: { type: String, enum: PAYMENT_TYPES, default: 'full' },
    billKeys: [String],
    notes: String,
    createdBy: ref('User', true),
    deletedAt: Date,
  },
  timestamps,
);
expenseSchema.index({ eventId: 1, categoryKey: 1, date: 1 });
expenseSchema.index({ vendorId: 1 });
expenseSchema.index({ date: 1 });
export const Expense = defineModel('Expense', expenseSchema, 'expenses');

const vendorSchema = new Schema(
  {
    name: { type: String, required: true },
    serviceType: { type: String, required: true },
    contactPerson: String,
    phone: String,
    email: String,
    eventIds: [ref('Event')],
    agreedAmountPaise: Number,
    balanceDueDate: Date,
    notes: String,
    deletedAt: Date,
  },
  timestamps,
);
vendorSchema.index({ serviceType: 1 });
vendorSchema.index({ name: 'text' });
export const Vendor = defineModel('Vendor', vendorSchema, 'vendors');

const shagunSchema = new Schema(
  {
    guestId: ref('Guest'),
    giverName: { type: String, required: true },
    eventId: ref('Event'),
    kind: { type: String, enum: SHAGUN_KINDS, default: 'cash' },
    amountPaise: Number,
    description: String,
    notes: String,
    recordedBy: ref('User', true),
  },
  timestamps,
);
shagunSchema.index({ eventId: 1 });
shagunSchema.index({ guestId: 1 });
export const Shagun = defineModel('Shagun', shagunSchema, 'shagun');
