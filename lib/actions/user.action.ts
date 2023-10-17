'use server'

import UserDocument from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetUserByIdParams, UpdateUserParams, ToggleSaveQuestionParams, GetSavedQuestionsParams } from "./shared"
import { revalidatePath } from "next/cache"
import QuestionDocument from "@/database/question.model"
import { UserListSchema, UserSchema, UserAllQuestionsSchema } from "../validations"

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

// export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
//   try {
//     connectToDatabase()
//     const { clerkId, filter, searchQuery, page = 1, pageSize = 10 } = params
//     const user: unknown = await UserDocument.findOne({ clerkId })
//     if (!user) {
//       throw new Error('User not found')
//     }
//     const parsedUser = UserSchema.safeParse(user)
//     if (!parsedUser.success) {
//       throw new Error('Error parsing user')
//     }
//     const questionIds = parsedUser.data.saved
//     let filterCmd = {}
//     switch (filter) {
//       case 'most_recent': filterCmd = { createdAt: -1 }; break;
//       case 'oldest': filterCmd = { createdAt: 1 }; break;
//       case 'most_voted': filterCmd = { upvotes: -1 }; break;
//       case 'most_answered': filterCmd = { answers: -1 }; break;
//     }
//     let searchCmd = {}
//     if (searchQuery) {
//       searchCmd = { _id: { $in: questionIds }, title: { $regex: searchQuery, $options: 'i' } }
//     } else {
//       searchCmd = { _id: { $in: questionIds } }
//     }
//     console.log("searchCmd: ", searchCmd)
//     const questions: unknown = await QuestionDocument.find(searchCmd)
//       .populate({ path: "tags", select: "_id name" })
//       .populate({ path: "author" })
//       .sort(filterCmd);
//     const parsedQuestions = QuestionListSchema.safeParse(questions)
//     if (!parsedQuestions.success) {
//       throw new Error('Error parsing questions')
//     }
//     return parsedQuestions.data;
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }