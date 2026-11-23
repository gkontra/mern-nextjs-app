import { SchemaTypes, Schema, model } from 'mongoose';

export const MODULE_STATUS = ['draft', 'published'];

const moduleSchema = new Schema(
  {
    moduleId: {
      type: SchemaTypes.Number,
      required: true,
      unique: true,
      min: 1,
      max: 10,
      validate: { validator: Number.isInteger, message: 'moduleId muss eine ganze Zahl sein' },
    },
    title: {
      type: SchemaTypes.String,
      required: true,
      trim: true,
    },
    description: {
      type: SchemaTypes.String,
      required: true,
      trim: true,
    },
    status: {
      type: SchemaTypes.String,
      enum: MODULE_STATUS,
      default: 'draft',
    },
    imageKey: {
      type: SchemaTypes.String,
      required: true,
      trim: true,
    },
    tags: {
      type: [SchemaTypes.String],
      default: [],
    },
  },
  {
    timestamps: true,
    //collection: 'modules'
  },
);

export const Module = model('Module', moduleSchema); // , 'modules'
export default Module;
