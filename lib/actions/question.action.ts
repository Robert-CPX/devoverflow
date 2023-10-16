'use server'

import { connectToDatabase } from "../mongoose"
import TagDocument from "@/database/tag.model";
import QuestionDocument from "@/database/question.model"
import AnswerDocument from "@/database/answer.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared";
import { revalidatePath } from "next/cache";
import { QuestionSchema, QuestionListSchema } from "../validations";

export const createQuestion = async (param: CreateQuestionParams) => {
  try {
    connectToDatabase();
    const { title, content, tags, author, path } = param;

    const question = await QuestionDocument.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await TagDocument.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag, creator: author }, $push: { questions: question._id } },
        { upsert: true, new: true }
      )
      tagDocuments.push(existingTag._id);
    }

    await QuestionDocument.findByIdAndUpdate(question._id, {
      $push: { tags: tagDocuments }
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getQuestions = async (param: GetQuestionsParams) => {
  try {
    connectToDatabase();
    AnswerDocument.find({})
    const questions: unknown = await QuestionDocument.find({})
      .populate({ path: "tags", select: "_id name" })
      .populate("author")
      .sort({ createdAt: -1 });
    const parsedQuestions = QuestionListSchema.safeParse(questions);
    if (!parsedQuestions.success) {
      throw parsedQuestions.error;
    }
    return parsedQuestions.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getQuestionById = async (param: GetQuestionByIdParams) => {
  try {
    connectToDatabase()
    const { questionId } = param;
    const questionDetail: unknown = await QuestionDocument.findById(questionId)
      .populate({ path: "tags", select: "_id name" })
      .populate({ path: "author" })
    const parsedQuestionDetail = QuestionSchema.parse(questionDetail);
    if (!parsedQuestionDetail) {
      throw new Error("Question not found");
    }
    return parsedQuestionDetail;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const upvoteQuestion = async (param: QuestionVoteParams) => {
  try {
    connectToDatabase()
    const { questionId, userId, hasupVoted, hasdownVoted, path } = param;
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId }
      }
    } else if (hasdownVoted) {
      updateQuery = {
        $push: { upvotes: userId },
        $pull: { downvotes: userId }
      }
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      }
    }
    const question = await QuestionDocument.findByIdAndUpdate(
      questionId,
      updateQuery,
      { new: true }
    )
    if (!question) {
      throw new Error("Question not found")
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const downvoteQuestion = async (param: QuestionVoteParams) => {
  try {
    connectToDatabase()
    const { questionId, userId, hasupVoted, hasdownVoted, path } = param;
    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId }
      }
    } else if (hasupVoted) {
      updateQuery = {
        $push: { downvotes: userId },
        $pull: { upvotes: userId }
      }
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      }
    }
    const question = await QuestionDocument.findByIdAndUpdate(
      questionId,
      updateQuery,
      { new: true }
    )
    if (!question) {
      throw new Error("Question not found")
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}