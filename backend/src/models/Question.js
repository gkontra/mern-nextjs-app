import { Schema, SchemaTypes as Type, model } from 'mongoose';

export const QUESTION_STATUS = ['draft', 'published'];
export const ANSWER_COUNT = { min: 2, max: 6 };

const answerSchema = new Schema({
  text: { type: Type.String, required: true },
  isCorrect: { type: Type.Boolean, required: true },
  explanation: { type: Type.String, default: '' },
});

const hasValidAnswers = (answers) =>
  answers.length >= ANSWER_COUNT.min &&
  answers.length <= ANSWER_COUNT.max &&
  answers.some((answer) => answer.isCorrect);

const questionSchema = new Schema(
  {
    categoryId: { type: Type.ObjectId, ref: 'Category', required: true },
    text: { type: Type.String, required: true },
    code: { type: Type.String, default: '' },
    answers: {
      type: [answerSchema],
      validate: {
        validator: hasValidAnswers,
        message: `Eine Frage braucht ${ANSWER_COUNT.min} bis ${ANSWER_COUNT.max} Antworten, mindestens eine davon richtig.`,
      },
    },
    successMessage: { type: Type.String, default: '' },
    errorMessage: { type: Type.String, default: '' },
    note: { type: Type.String, default: '' },
    status: { type: Type.String, enum: QUESTION_STATUS, default: 'draft' },
    seedKey: { type: Type.String, unique: true, sparse: true, trim: true },
  },
  { timestamps: true },
);

questionSchema.index({ categoryId: 1, status: 1 });

export const Question = model('Question', questionSchema);

export default Question;
