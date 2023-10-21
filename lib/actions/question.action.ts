'use server'

import { connectToDatabase } from "../mongoose"
import TagDocument from "@/database/tag.model";
import QuestionDocument from "@/database/question.model"
import { CreateQuestionParams, DeleteQuestionParams, EditQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared";
import { revalidatePath } from "next/cache";
import { QuestionSchema, QuestionListSchema, TopQuestionListSchema } from "../validations";
import AnswerDocument from "@/database/answer.model";
import InteractionDocument from "@/database/interaction.model";

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
        { $setOnInsert: { name: tag, creator: author, description: 'a piece of description' }, $push: { questions: question._id } },
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

export const editQuestion = async (param: EditQuestionParams) => {
  try {
    connectToDatabase();
    const { questionId, content, title, tags, path } = param;
    await QuestionDocument.findOneAndUpdate(
      { _id: questionId },
      { content, title, tags: [] }
    )
    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await TagDocument.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag, description: 'a piece of description' }, $push: { questions: questionId } },
        { upsert: true, new: true }
      )
      tagDocuments.push(existingTag._id);
    }
    await QuestionDocument.findByIdAndUpdate(questionId, {
      $addToSet: { tags: tagDocuments }
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getQuestions = async (param: GetQuestionsParams) => {
  try {
    connectToDatabase()
    const { page = 1, pageSize = 10, searchQuery, filter } = param;
    const skipAmount = (page - 1) * pageSize;
    let searchCmd = {}
    if (searchQuery) {
      const regexValue = { $regex: new RegExp(searchQuery, "i") }
      searchCmd = { $or: [{ title: regexValue }, { content: regexValue }] }
    }
    let filterCmd = {}
    switch (filter) {
      case 'newest': filterCmd = { createdAt: -1 }; break;
      case 'recommended': filterCmd = { upvotes: 1 }; break;
      case 'frequent': filterCmd = { views: -1 }; break;
      case 'unanswered': filterCmd = { answers: 1 }; break;
    }
    const questions: unknown = await QuestionDocument.find(searchCmd, null, { skip: skipAmount, limit: pageSize, sort: filterCmd })
      .populate({ path: "tags", select: "_id name" })
      .populate("author");
    const parsedQuestions = QuestionListSchema.safeParse(questions);
    if (!parsedQuestions.success) {
      throw parsedQuestions.error;
    }
    const totalCount = await QuestionDocument.countDocuments(searchCmd);
    const isNext = (skipAmount + parsedQuestions.data.length) < totalCount;
    return { questions: parsedQuestions.data, isNext };
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

export const deleteQuestion = async (param: DeleteQuestionParams) => {
  try {
    connectToDatabase()
    const { questionId, path } = param
    await QuestionDocument.deleteOne({ _id: questionId })
    await AnswerDocument.deleteMany({ question: questionId })
    await InteractionDocument.deleteMany({ question: questionId })
    await TagDocument.updateMany({ questions: questionId }, { $pull: { questions: questionId } })
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getTopQuestions = async () => {
  try {
    connectToDatabase()
    const questions: unknown = await QuestionDocument.aggregate([
      { $limit: 5 },
      {
        $project: {
          "_id": 1,
          "views": 1,
          "title": 1,
          "upvotesNum": { $size: "$upvotes" },
          "savesNum": { $size: "$saves" },
          "answersNum": { $size: "$answers" },
        }
      },
      { $sort: { "answersNum": -1, "upvotesNum": -1, "savesNum": -1, "views": -1 } },
    ])
    const parsedQuestions = TopQuestionListSchema.safeParse(questions);
    if (!parsedQuestions.success) {
      throw parsedQuestions.error;
    }
    return parsedQuestions.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
}