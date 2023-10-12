import { Schema, model, models } from 'mongoose'

export type Answer = {
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  createdAt: Date;
} | Document;

const AnswerSchema = new Schema({
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
})

const AnswerDocument = models.Answer || model('Answer', AnswerSchema)

export default AnswerDocument