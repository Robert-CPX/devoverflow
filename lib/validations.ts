import * as z from "zod"
import { ObjectId } from 'mongoose'

export const QuestionFormSchema = z.object({
  title: z.string().min(3).max(130),
  detail: z.string().nonempty(),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
})

export const AnswerFormSchema = z.object({
  answer: z.string().nonempty(),
})

export const UserSchema = z.object({
  _id: z.coerce.string(),
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
  saved: z.coerce.string().array(),
  joinedAt: z.date(),
})

export const UserListSchema = z.array(UserSchema)

const TagSchema = z.object({
  _id: z.coerce.string(),
  name: z.string(),
  description: z.string(),
  questions: z.coerce.string().array(),
  followers: z.coerce.string().array(),
  creator: z.coerce.string(),
  createdAt: z.date(),
})

export const TagListSchema = z.array(TagSchema)

export const AnswerSchema = z.object({
  _id: z.coerce.string(),
  content: z.string().nonempty(),
  upvotes: z.coerce.string().array(),
  downvotes: z.coerce.string().array(),
  author: z.custom<{ _id: ObjectId, clerkId: string, name: string, picture: string }>(),
  createdAt: z.date(),
})

export const AnswerListSchema = z.array(AnswerSchema)

export const QuestionSchema = z.object({
  _id: z.coerce.string(),
  title: z.string().min(3).max(130),
  content: z.string().nonempty(),
  tags: z.custom<{ _id: ObjectId, name: string }>().array(),
  views: z.number(),
  author: UserSchema,
  answers: z.coerce.string().array(),
  upvotes: z.coerce.string().array(),
  downvotes: z.coerce.string().array(),
  saves: z.coerce.string().array(),
  createdAt: z.date(),
})

export const QuestionListSchema = z.array(QuestionSchema)

export const UserAllQuestionsSchema = z.object({
  _id: z.coerce.string(),
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
  saved: QuestionListSchema,
  joinedAt: z.date(),
})

export const TagAllQuestionsSchema = z.object({
  _id: z.coerce.string(),
  name: z.string(),
  description: z.string(),
  questions: QuestionListSchema,
  followers: z.coerce.string().array(),
  creator: z.coerce.string(),
  createdAt: z.date(),
})