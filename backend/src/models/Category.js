import { Schema, SchemaTypes as Type, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: Type.String, required: true, unique: true, trim: true },
    slug: { type: Type.String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: Type.String, default: '', trim: true },
    moduleId: {
      type: Type.Number,
      default: null,
      min: 1,
      max: 7,
      validate: {
        validator: (value) => value === null || Number.isInteger(value),
        message: 'moduleId muss eine ganze Zahl sein.',
      },
    },
  },
  { timestamps: true },
);

export const Category = model('Category', categorySchema);

export default Category;
