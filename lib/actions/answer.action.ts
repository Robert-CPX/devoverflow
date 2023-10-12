import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams } from "./shared";
import AnswerDocument from "@/database/answer.model";
import QuestionDocument from "@/database/question.model";

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