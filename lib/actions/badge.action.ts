import QuestionDocument from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import { GetBadgesParams } from "./shared"
import AnswerDocument from "@/database/answer.model"
import mongoose from "mongoose"
import UserDocument from "@/database/user.model"
import { calculateBadges } from "../utils"

/**
 * Criteria:
 * based on reputation
 * Every 1 Bronze: ask 5 questions and answer 10 questions, and get at least 50 upvotes, and most viewed question has at least 100 views
 * Every 1 Silver: ask 10 questions and answer 20 questions, and get at least 500 upvotes, and most viewed question has at least 1000 views
 * Every 1 Gold: ask 20 questions and answer 40 questions, and get at least 10000 upvotes, and most viewed question has at least 10000 views
 */
export const getBadges = async (params: GetBadgesParams) => {
  try {
    connectToDatabase()
    const { userId } = params
    const user = await UserDocument.findById(userId).select('reputation')
    const questions = await QuestionDocument.countDocuments({ author: userId })
    const answers = await AnswerDocument.countDocuments({ author: userId })
    const upvotes = await QuestionDocument.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      // { $unwind: '$upvotes' },
      { $project: { _id: 0, upvotes: { $size: '$upvotes' } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ])

    const mostViewedQuestion = await QuestionDocument.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      { $sort: { views: -1 } },
      { $limit: 1 },
    ])
    const badges = calculateBadges({
      reputation: user.reputation,
      questionNum: questions,
      answerNum: answers,
      upvotes: upvotes.length > 0 ? upvotes[0].totalUpvotes : 0,
      mostViewedQuestion: mostViewedQuestion.length > 0 ? mostViewedQuestion[0].views : 0,
    })
    return badges
  } catch (error) {
    console.log(error)
    throw error
  }
}