import { Schema, model, models, Document } from 'mongoose'

export type User = {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  location?: string;
  profileLink?: string;
  reputation?: number;
  saved: Schema.Types.ObjectId[];
  joinedAt: Date;
} | Document

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: String,
  bio: String,
  picture: { type: String, required: true },
  location: String,
  profileLink: String,
  reputation: { type: Number, default: 0 },
  saved: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  joinedAt: { type: Date, default: Date.now },
})

const UserDocument = models.User || model('User', UserSchema)

export default UserDocument