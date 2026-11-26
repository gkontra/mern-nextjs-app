import { NAME_LENGTH } from '@mearn/shared/auth';
import { ROLES } from '@mearn/shared/user';
import { Schema, model, SchemaTypes as Types } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: Types.String, //
      required: true,
      trim: true,
      minlength: NAME_LENGTH.min,
      maxlength: NAME_LENGTH.max,
    },
    email: {
      type: Types.String, //
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: Types.String, //
      required: true,
      select: false,
    },
    role: {
      type: Types.String, //
      enum: ROLES,
      default: 'participant',
    },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);

export default User;
