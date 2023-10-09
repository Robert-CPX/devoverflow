'use server'

import UserDocument from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetUserByIdParams, UpdateUserParams } from "./shared"
import { revalidatePath } from "next/cache"
import QuestionDocument from "@/database/question.model"
import AnswerDocument from "@/database/answer.model"
import TagDocument from "@/database/tag.model"

export const getUsereById = async (params: GetUserByIdParams) => {
  try {
    connectToDatabase()
    const user = await UserDocument.findOne({ clerkId: params.userId })
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const createUser = async (userData: CreateUserParams) => {
  try {
    connectToDatabase()
    const newUser = await UserDocument.create(userData)
    return newUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateUser = async (params: UpdateUserParams) => {
  try {
    connectToDatabase()
    const { clerkId, updateData, path } = params
    const updatedUser = await UserDocument.findOneAndUpdate(
      { clerkId },
      updateData,
      { new: true }
    )
    revalidatePath(path)
    return updatedUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    connectToDatabase()
    const { clerkId } = params
    const deletedUser = await UserDocument.findOneAndDelete({ clerkId })
    if (!deletedUser) {
      throw new Error('User not found')
    }

    const userQuestionIds = await QuestionDocument.find({ author: deletedUser._id }).distinct('_id')
    await QuestionDocument.deleteMany({ author: deletedUser._id })

    return deletedUser
  } catch (error) {
    console.log(error)
    throw error
  }
}