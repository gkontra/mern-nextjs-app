import { QUESTION_MESSAGES, QUESTION_STATUS, hasValidAnswers } from '@mearn/shared/question';
import { Schema, SchemaTypes as Types, model } from 'mongoose';

const { ObjectId, String } = Types;

const answerSchema = new Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  explanation: { type: String, default: '' },
});

const questionSchema = new Schema(
  {
    categoryId: { type: ObjectId, ref: 'Category', required: true },
    text: { type: String, required: true },
    code: { type: String, default: '' },
    answers: {
      type: [answerSchema],
      validate: { validator: hasValidAnswers, message: QUESTION_MESSAGES.answers() },
    },
    successMessage: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
    note: { type: String, default: '' },
    status: { type: String, enum: QUESTION_STATUS, default: 'draft' },
    seedKey: { type: String, unique: true, sparse: true, trim: true },
  },
  { timestamps: true },
);

questionSchema.index({ categoryId: 1, status: 1 });

export const Question = model('Question', questionSchema);

export default Question;
