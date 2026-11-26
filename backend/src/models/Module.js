import { MODULE_ID, MODULE_MESSAGES, MODULE_STATUS } from '@mearn/shared/module';
import { Schema, SchemaTypes as Types, model } from 'mongoose';

const moduleSchema = new Schema(
  {
    moduleId: {
      type: Types.Number,
      required: true,
      unique: true,
      min: MODULE_ID.min,
      max: MODULE_ID.max,
      validate: { validator: Number.isInteger, message: MODULE_MESSAGES.moduleIdInteger },
    },
    title: { type: Types.String, required: true, trim: true },
    description: { type: Types.String, required: true, trim: true },
    status: { type: Types.String, enum: MODULE_STATUS, default: 'draft' },
    imageKey: { type: Types.String, required: true, trim: true },
    tags: { type: [Types.String], default: [] },
  },
  { timestamps: true },
);

export const Module = model('Module', moduleSchema);

export default Module;
