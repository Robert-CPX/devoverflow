'use server'

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared";
import AnswerDocument from "@/database/answer.model";
import QuestionDocument from "@/database/question.model";
import { AnswerListSchema } from "../validations";
import InteractionDocument from "@/database/interaction.model";
import { updateReputation } from "./user.action";

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

    await updateReputation({ userId: author, action: 'create_answer', answerId: newAnswer._id, questionId: question })
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getAnswers = async (param: GetAnswersParams) => {
  try {
    connectToDatabase()
    const { questionId, sortBy, page = 1, pageSize = 10 } = param;
    let filterCmd = {}
    const skipAmount = (page - 1) * pageSize;
    switch (sortBy) {
      case 'highestUpvotes': filterCmd = { upvotes: -1 }; break;
      case 'lowestUpvotes': filterCmd = { upvotes: 1 }; break;
      case 'recent': filterCmd = { createdAt: -1 }; break;
      case 'old': filterCmd = { createdAt: 1 }; break;
    }
    const answers: unknown = await AnswerDocument.find({ question: questionId }, null, { skip: skipAmount, limit: pageSize, sort: filterCmd })
      .populate({
        path: "author",
        select: "name picture _id clerkId",
      })
    const parsedAnswers = AnswerListSchema.safeParse(answers);
    if (!parsedAnswers.success) {
      throw parsedAnswers.error;
    }
    const totalCount = await AnswerDocument.countDocuments({ question: questionId })
    const isNext = (skipAmount + parsedAnswers.data.length) < totalCount;
    return { answers: parsedAnswers.data, isNext };
  } catch (error) {
    console.log(error)
    throw error
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
    if (!hasupVoted || hasdownVoted) {
      await updateReputation({ userId, action: 'upvote_answer', answerId: answer._id })
      await updateReputation({ userId: answer.author, action: 'receive_upvote', answerId: answer._id })
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
    if (!hasdownVoted || hasupVoted) {
      await updateReputation({ userId, action: 'downvote_answer', answerId: answer._id })
      await updateReputation({ userId: answer.author, action: 'receive_downvote', answerId: answer._id })
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    connectToDatabase()
    const { answerId, path } = params
    const answer: any = await AnswerDocument.findOneAndDelete({ _id: answerId })
    if (!answer) {
      throw new Error("Answer not found")
    }
    await QuestionDocument.findOneAndUpdate({ _id: answer.question }, {
      $pull: { answers: answerId }
    })
    await InteractionDocument.deleteMany({ answer: answerId })
    await updateReputation({ userId: answer.author, action: "delete_answer", answerId });
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}