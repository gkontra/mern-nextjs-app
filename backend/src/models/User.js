import { Schema, model, SchemaTypes } from 'mongoose';
import { NAME_LENGTH } from '../lib/authValidation.js';

export const ROLES = ['participant', 'trainer'];

const userSchema = new Schema(
  {
    name: {
      type: SchemaTypes.String,
      required: true,
      trim: true,
      minlength: NAME_LENGTH.min,
      maxlength: NAME_LENGTH.max,
    },
    email: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: SchemaTypes.String,
      required: true,
      select: false, // wichtig .select('+passwordHash') // standardabfragen mit .find() oder .findOne() wird feld nicht mit ausgelesen.
    },
    role: {
      type: SchemaTypes.String,
      enum: ROLES,
      default: 'participant',
    },
  },
  {
    timestamps: true, // createtAt und updatedAt mit Date now wird angelegt
    // collection: 'users'
  },
);

export const User = model('User', userSchema);
export default User;
