'use server'

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared";
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

export const upvoteAnswer = async (param: AnswerVoteParams) => {
  try {
    connectToDatabase()
    const { answerId, userId, hasupVoted, hasdownVoted, path } = param;
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $push: { upvotes: userId },
        $pull: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const answer = await AnswerDocument.findByIdAndUpdate(
      answerId,
      updateQuery,
    )
    if (!answer) {
      throw new Error("Answer not found")
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export const downvoteAnswer = async (param: AnswerVoteParams) => {
  try {
    connectToDatabase()
    const { answerId, userId, hasupVoted, hasdownVoted, path } = param;
    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $push: { downvotes: userId },
        $pull: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const answer = await AnswerDocument.findByIdAndUpdate(
      answerId,
      updateQuery
    )
    if (!answer) {
      throw new Error("Answer not found")
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}