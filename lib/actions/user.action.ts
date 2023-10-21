'use server'

import UserDocument from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetUserByIdParams, UpdateUserParams, ToggleSaveQuestionParams, GetSavedQuestionsParams, GetUserStatsParams } from "./shared"
import { revalidatePath } from "next/cache"
import QuestionDocument from "@/database/question.model"
import { UserListSchema, UserSchema, UserAllQuestionsSchema, QuestionListSchema, AnswerWithQuestionListSchema } from "../validations"
import AnswerDocument from "@/database/answer.model"

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
    const { page = 1, pageSize = 10, filter, searchQuery } = params
    const skipAmount = (page - 1) * pageSize;
    let searchCmd = {}
    if (searchQuery) {
      const regexValue = { $regex: new RegExp(searchQuery, "i") }
      searchCmd = { $or: [{ name: regexValue }, { username: regexValue }] }
    }
    let filterCmd = {}
    switch (filter) {
      case 'new_users': filterCmd = { joinedAt: -1 }; break;
      case 'old_users': filterCmd = { joinedAt: 1 }; break;
      case 'top_contributors': filterCmd = { reputation: -1 }; break;
    }

    const allUsers: unknown = await UserDocument.find(searchCmd, null, { skip: skipAmount, limit: pageSize, sort: filterCmd })
    const parsedResult = UserListSchema.safeParse(allUsers)
    if (!parsedResult.success) {
      throw new Error('Error parsing all users')
    }
    const totalCount = await UserDocument.countDocuments(searchCmd)
    const isNext = (skipAmount + parsedResult.data.length) < totalCount;
    return { allUsers: parsedResult.data, isNext }
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
      case 'most_viewed': filterCmd = { views: -1 }; break;
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
        options: { sort: filterCmd, skip: (page - 1) * pageSize, limit: pageSize + 1 },
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
    const isNext = parsedResult.data.saved.length > pageSize
    return { questions: parsedResult.data.saved, isNext };
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
    const skipAmount = (page - 1) * pageSize;
    const questions: unknown = await QuestionDocument.find({ author: userId })
      .limit(pageSize)
      .skip(skipAmount)
      .sort({ views: -1, upvotes: -1 })
      .populate({ path: "tags", select: "_id name" })
      .populate("author");
    const parsedQuestions = QuestionListSchema.safeParse(questions);
    if (!parsedQuestions.success) {
      console.log(parsedQuestions.error)
      throw parsedQuestions.error;
    }
    const totalCount = await QuestionDocument.countDocuments({ author: userId });
    const isNext = (skipAmount + parsedQuestions.data.length) < totalCount
    return { questions: parsedQuestions.data, isNext }
  } catch (error) {
    console.log(error)
    throw error;
  }
}
// TODO: if user have more than 1 answer under the same question, ui will show the same item multiple times
export const getAnswersByUser = async (param: GetUserStatsParams) => {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = param;
    const skipAmount = (page - 1) * pageSize;
    const answers = await AnswerDocument.find({ author: userId })
      .limit(pageSize)
      .skip(skipAmount)
      .sort({ upvotes: -1 })
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture")

    const parsedAnswers = AnswerWithQuestionListSchema.safeParse(answers);
    if (!parsedAnswers.success) {
      throw parsedAnswers.error
    }
    const totalCount = await AnswerDocument.countDocuments({ author: userId });
    const isNext = (skipAmount + parsedAnswers.data.length) < totalCount;
    return { answers: parsedAnswers.data, isNext }
  } catch (error) {
    console.log(error)
    throw error;
  }
}
