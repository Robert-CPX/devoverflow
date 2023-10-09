'use server'

import { connectToDatabase } from "../mongoose"
import Question from "@/database/question.model"
import Tag from "@/database/tag.model";

export const createQuestion = async (param: any) => {
  try {
    connectToDatabase();
    const { title, content, tags, author, path } = param;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      )
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: tagDocuments }
    });
  } catch (error) {

  }
}