'use server'

import { connectToDatabase } from "../mongoose"
import { ViewQuestionParams } from "./shared"
import QuestionDocument from "@/database/question.model"
import InteractionDocument from "@/database/interaction.model"

export const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    connectToDatabase()
    const { questionId, userId } = params

    await QuestionDocument.findByIdAndUpdate(questionId, { $inc: { views: 1 } })
    if (userId) {
      const existingInteraction = await InteractionDocument.findOne({
        user: userId,
        question: questionId,
        action: 'view'
      })
      if (existingInteraction) return
      await InteractionDocument.create({
        user: userId,
        question: questionId,
        action: 'view'
      })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
