import { Schema, model, models, type Model } from 'mongoose';

export const ObjectId = Schema.Types.ObjectId;
export const ref = (to: string, required = false) => ({ type: ObjectId, ref: to, required });
export const timestamps = { timestamps: true } as const;

/** Reuse an already compiled model (safe with hot reload and multiple imports). */
export function defineModel<T>(name: string, schema: Schema<T>, collection?: string): Model<T> {
  return (models[name] as Model<T>) || model<T>(name, schema, collection);
}
