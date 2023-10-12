'use server'

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared";
import AnswerDocument from "@/database/answer.model";
import QuestionDocument from "@/database/question.model";
import { AnswerListSchema } from "../validations";

export const createAnswer = async (param: CreateAnswerParams) => {
  try {
    connectToDatabase()
    const { content, author, question, path } = param;
    const newAnswer = await AnswerDocument.create({
      content,
      author,
      question,
    });
    await QuestionDocument.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getAnswers = async (param: GetAnswersParams) => {
  try {
    connectToDatabase()
    const { questionId } = param;
    const answers: unknown = await AnswerDocument.find({ question: questionId })
      .populate({
        path: "author",
        select: "name picture _id clerkId",
      })
      .sort({ createdAt: -1 })
    const parsedAnswers = AnswerListSchema.safeParse(answers);
    if (!parsedAnswers.success) {
      throw parsedAnswers.error;
    }
    return parsedAnswers.data;
  } catch (error) {
    console.log(error)
  }
}