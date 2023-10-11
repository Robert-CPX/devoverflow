import * as z from "zod"
import mongoose, { Schema } from 'mongoose'

export const QuestionFormSchema = z.object({
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

export const AnswerSchema = z.object({
  content: z.string().nonempty(),
  upvotes: z.number(),
  downvotes: z.number(),
  author: UsersSchema,
  createdAt: z.date(),
})

export const QuestionSchema = z.object({
  _id: z.custom<mongoose.ObjectId>(),
  title: z.string().min(3).max(130),
  content: z.string().nonempty(),
  tags: z.custom<{ _id: string, name: string }>().array(),
  views: z.number(),
  author: z.custom<{ _id: string, clerkId: string, name: string, picture: string }>(),
  answers: AnswerSchema.array(),
  createdAt: z.date(),
})
