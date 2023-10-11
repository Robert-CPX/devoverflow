'use server'

import { connectToDatabase } from "../mongoose"
import TagDocument from "@/database/tag.model";
import QuestionDocument from "@/database/question.model"
import AnswerDocument from "@/database/answer.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams } from "./shared";
import { revalidatePath } from "next/cache";
import { QuestionSchema } from "../validations";

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
    const questions = await QuestionDocument.find({})
      .populate("tags")
      .populate("author")
      .sort({ createdAt: -1 });
    return { questions };
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getQuestionById = async (param: GetQuestionByIdParams) => {
  try {
    connectToDatabase()
    const { questionId } = param;
    const questionDetail = await QuestionDocument.findById(questionId)
      .populate({ path: "tags", select: "_id name" })
      .populate({ path: "author", select: "_id clerkId name picture" })
      .populate("answers")

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