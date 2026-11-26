import { SchemaTypes, Schema, model } from 'mongoose';

const { ObjectId, Boolean, Number, String, Date } = SchemaTypes;

export const ATTEMPT_STATUS = ['running', 'submitted'];

const itemSchema = new Schema(
  {
    questionId: { type: ObjectId, ref: 'Question', required: true },
    answerOrder: { type: [ObjectId], default: [] },
    selectedAnswerIds: { type: [ObjectId], default: [] },
    isCorrect: { type: Boolean, default: null },
  },
  { _id: false },
);

const resultSchema = new Schema(
  {
    correct: { type: Number, required: true },
    wrong: { type: Number, required: true },
    unanswered: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false },
);

const attemptSchema = new Schema(
  {
    userId: { type: ObjectId, ref: 'User', required: true },
    categoryIds: { type: [{ type: ObjectId, ref: 'Category' }], required: true },
    questionCount: { type: Number, required: true, min: 1 },
    timeLimitSec: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ATTEMPT_STATUS, default: 'running' },
    startedAt: { type: Date, required: true, default: Date.now },
    submittedAt: { type: Date, default: null },
    timedOut: { type: Boolean, default: false },
    items: { type: [itemSchema], default: [] },
    result: { type: resultSchema, default: undefined },
  },
  { timestamps: true },
);

attemptSchema.index({ userId: 1, startedAt: -1 });
attemptSchema.index({ userId: 1 }, { unique: true, partialFilterExpression: { status: 'running' } });

export const Attempt = model('Attempt', attemptSchema);

export default Attempt;
