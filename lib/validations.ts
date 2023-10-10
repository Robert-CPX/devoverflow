import * as z from "zod"
import mongoose, { Schema } from 'mongoose'

export const QuestionsSchema = z.object({
  title: z.string().min(3).max(130),
  detail: z.string().nonempty(),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
})

const UserSchema = z.object({
  _id: z.custom<mongoose.ObjectId>(),
  clerkId: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  bio: z.string().optional(),
  picture: z.string(),
  location: z.string().optional(),
  profileLink: z.string().optional(),
  reputation: z.number(),
  saved: z.number().array(),
  joinedAt: z.date(),
})

export const UsersSchema = z.array(UserSchema)

const TagSchema = z.object({
  _id: z.custom<mongoose.ObjectId>(),
  name: z.string(),
  description: z.string(),
  questions: z.custom<Schema.Types.ObjectId>().array(),
  followers: z.custom<Schema.Types.ObjectId>().array(),
  creator: z.custom<Schema.Types.ObjectId>(),
  createdAt: z.date(),
})

export const TagsSchema = z.array(TagSchema)