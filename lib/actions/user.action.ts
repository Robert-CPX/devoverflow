'use server'

import UserDocument from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetUserByIdParams, UpdateUserParams, ToggleSaveQuestionParams, GetSavedQuestionsParams, GetUserStatsParams, SearchParams, UpdateReputationParams } from "./shared"
import { revalidatePath } from "next/cache"
import QuestionDocument from "@/database/question.model"
import { UserListSchema, UserSchema, UserAllQuestionsSchema, QuestionListSchema, AnswerWithQuestionListSchema, GlobalSearchListSchema } from "../validations"
import AnswerDocument from "@/database/answer.model"
import TagDocument from "@/database/tag.model"
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
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
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
      .sort({ createdAt: -1, upvotes: -1 })
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

// free Atlas account can only create 3 indexes, sad...
export const getGlobalSearchResult = async (params: SearchParams) => {
  try {
    connectToDatabase()
    let result = []
    const { query, type } = params
    if (!query) return null
    if (!type) {
      const questions = await QuestionDocument.aggregate([
        { $search: { index: "default", text: { query, path: "title" } } },
        { $limit: 2 },
        { $project: { _id: 1, title: 1, type: "question" } }
      ])

      const answers = await AnswerDocument.aggregate([
        { $search: { index: "default", text: { query, path: "content" } } },
        { $limit: 2 },
        { $project: { _id: '$question', title: `Answers containing ${query}`, type: "answer" } }
      ])

      const tags = await TagDocument.aggregate([
        { $search: { index: "default", text: { query, path: "name" } } },
        { $limit: 2 },
        { $project: { _id: 1, title: "$name", type: "tag" } }
      ])

      const regexValue = { $regex: new RegExp(query, "i") }
      const users = await UserDocument.find({ $or: [{ name: regexValue }, { username: regexValue }] }, null, { limit: 2 })
      const parsedUsers = UserListSchema.safeParse(users)
      let formattedUsers: { _id: string, title: string, type: string }[] = []
      if (parsedUsers.success) {
        formattedUsers = parsedUsers.data.map(user => {
          return {
            _id: user.clerkId,
            title: user.name,
            type: "user"
          }
        })
      }
      result.push(...questions, ...answers, ...tags, ...formattedUsers)
    } else {
      switch (type) {
        case 'question':
          result = await QuestionDocument.aggregate([
            { $search: { index: "default", text: { query, path: "title" } } },
            { $limit: 8 },
            { $project: { _id: 1, title: 1, type: "question" } }
          ])
          break;
        case 'answer':
          result = await AnswerDocument.aggregate([
            { $search: { index: "default", text: { query, path: "content" } } },
            { $limit: 8 },
            { $project: { _id: '$question', title: `Answers containing ${query}`, type: "answer" } }
          ])
          break;
        case 'tag':
          result = await TagDocument.aggregate([
            { $search: { index: "default", text: { query, path: "name" } } },
            { $limit: 8 },
            { $project: { _id: 1, title: "$name", type: "tag" } }
          ])
          break;
        case 'user':
          {
            const users = await UserDocument.find({ $or: [{ name: { $regex: new RegExp(query, "i") } }, { username: { $regex: new RegExp(query, "i") } }] }).limit(8)
            const parsedUsers = UserListSchema.safeParse(users)
            if (parsedUsers.success) {
              result = parsedUsers.data.map(user => {
                return {
                  _id: user.clerkId,
                  title: user.name || user.username,
                  type: "user"
                }
              })
            }
          }
          break;
        default:
          result = []
          break;
      }
    }
    const parsedResult = GlobalSearchListSchema.safeParse(result)
    if (!parsedResult.success) {
      throw parsedResult.error
    }
    return parsedResult.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const updateReputation = async (params: UpdateReputationParams) => {
  try {
    connectToDatabase();
    const { userId, action, questionId, answerId } = params
    let change = {}
    switch (action) {
      case "create_question": change = { reputation: +5 }; break
      case "delete_question": change = { reputation: -5 }; break
      case "create_answer": change = { reputation: +5 }; break
      case "delete_answer": change = { reputation: -5 }; break
      case "upvote_question": change = { reputation: +1 }; break
      case "upvote_answer": change = { reputation: +1 }; break
      case "downvote_question": change = { reputation: -1 }; break
      case "downvote_answer": change = { reputation: -1 }; break
      case "receive_upvote": change = { reputation: +10 }; break
      case "receive_downvote": change = { reputation: -5 }; break
      default: change = { reputation: +0 }; break
    }
    await InteractionDocument.create({
      user: userId,
      questionId,
      answerId,
      action
    })

    await UserDocument.findByIdAndUpdate(userId, {
      $inc: change
    });

  } catch (error) {
    console.log(error)
  }
}