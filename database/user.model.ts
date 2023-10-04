import { Schema, model, models } from 'mongoose'

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

const User = models.User || model('User', UserSchema)

export default User