'use server'

import UserDocument from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetUserByIdParams, UpdateUserParams, ToggleSaveQuestionParams, GetSavedQuestionsParams, GetAnswersByUserParams, GetUserStatsParams } from "./shared"
import { revalidatePath } from "next/cache"
import QuestionDocument from "@/database/question.model"
import { UserListSchema, UserSchema, UserAllQuestionsSchema, QuestionListSchema } from "../validations"
import AnswerDocument from "@/database/answer.model"
import InteractionDocument from "@/database/interaction.model"

export const getUsereById = async (params: GetUserByIdParams) => {
  try {
    connectToDatabase()
    const user: unknown = await UserDocument.findOne({ clerkId: params.userId })
    const parsedUser = UserSchema.safeParse(user)
    if (!parsedUser.success) {
      throw new Error('Error parsing user')
    }
    return parsedUser.data
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

    // const userQuestionIds = await QuestionDocument.find({ author: deletedUser._id }).distinct('_id')
    await QuestionDocument.deleteMany({ author: deletedUser._id })

    return deletedUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    connectToDatabase()
    const allUsers: unknown = await UserDocument.find({})
      .sort({ createdAt: -1 });
    const parsedAllUsers = UserListSchema.safeParse(allUsers)
    if (!parsedAllUsers.success) {
      throw new Error('Error parsing all users')
    }
    return { parsedAllUsers };
  } catch (error) {
    console.log(error)
    throw error
  }
}
// TODO: in video, why he doesn't upate QuestionDocument?
export const saveQuestion = async (param: ToggleSaveQuestionParams) => {
  try {
    connectToDatabase()
    const { questionId, userId, path } = param
    const user = await UserDocument.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    const isQuestionSaved = user.saved.includes(questionId)
    if (isQuestionSaved) {
      await user.updateOne({ $pull: { saved: questionId } })
      await QuestionDocument.findByIdAndUpdate(questionId, {
        $pull: { saves: user._id }
      });
    } else {
      await user.updateOne({ $push: { saved: questionId } })
      await QuestionDocument.findByIdAndUpdate(questionId, {
        $push: { saves: user._id }
      });
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    connectToDatabase()
    const { clerkId, filter, searchQuery, page = 1, pageSize = 10 } = params
    let filterCmd = {}
    switch (filter) {
      case 'most_recent': filterCmd = { createdAt: -1 }; break;
      case 'oldest': filterCmd = { createdAt: 1 }; break;
      case 'most_voted': filterCmd = { upvotes: -1 }; break;
      case 'most_answered': filterCmd = { answers: -1 }; break;
    }
    let searchCmd = {}
    if (searchQuery) {
      searchCmd = { title: { $regex: new RegExp(searchQuery, "i") } }
    }
    const user: unknown = await UserDocument.findOne({ clerkId })
      .populate({
        path: "saved",
        match: searchCmd,
        options: { sort: filterCmd, skip: (page - 1) * pageSize, limit: pageSize },
        populate: [{
          path: "tags",
          select: "_id name"
        }, {
          path: "author"
        }]
      })
    if (!user) {
      throw new Error('User not found')
    }
    const parsedResult = UserAllQuestionsSchema.safeParse(user)

    if (!parsedResult.success) {
      throw new Error('Error parsing user with all questions')
    }
    return parsedResult.data.saved;
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    connectToDatabase()
    const user: unknown = await UserDocument.findOne({ clerkId: params.userId })
    const parsedUser = UserSchema.safeParse(user)
    if (!parsedUser.success) {
      throw new Error('Error parsing user')
    }
    const totalQuestions = await QuestionDocument.countDocuments({ author: parsedUser.data._id })
    const totalAnswers = await AnswerDocument.countDocuments({ author: parsedUser.data._id })
    return { user: parsedUser.data, totalQuestions, totalAnswers }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getQuestionsByUser = async (param: GetUserStatsParams) => {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = param;
    const questions: unknown = await QuestionDocument.find({ author: userId })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ views: -1, upvotes: -1 })
      .populate({ path: "tags", select: "_id name" })
      .populate("author");
    console.log(questions)
    const parsedQuestions = QuestionListSchema.safeParse(questions);
    if (!parsedQuestions.success) {
      console.log(parsedQuestions.error)
      throw parsedQuestions.error;
    }
    return parsedQuestions.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getAnswersByUser = async (param: GetAnswersByUserParams) => {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = param;
    const questionId = await InteractionDocument.find({ user: userId, action: 'answered' })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .distinct('question')
    const questions: unknown = await QuestionDocument.find({ _id: { $in: questionId } })
    const parsedQuestions = QuestionListSchema.safeParse(questions);
    if (!parsedQuestions.success) {
      throw parsedQuestions.error
    }
    return parsedQuestions.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}
