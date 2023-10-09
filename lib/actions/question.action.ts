'use server'

import { connectToDatabase } from "../mongoose"
import QuestionDocument from "@/database/question.model"
import TagDocument from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared";
import { revalidatePath } from "next/cache";

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
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
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