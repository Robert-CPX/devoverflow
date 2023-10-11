import { Schema, model, models } from 'mongoose'

export type Answer = {
  content: string;
  upvotes: number;
  downvotes: number;
  author: Schema.Types.ObjectId[];
  createdAt: Date;
} | Document;

const AnswerSchema = new Schema({
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  author: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
})

const AnswerDocument = models.Answer || model('Answer', AnswerSchema)

export default AnswerDocument