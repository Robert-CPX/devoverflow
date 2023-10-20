'use server'

import TagDocument from "@/database/tag.model"
import { connectToDatabase } from "../mongoose"
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared"
import { PopularTagListSchema, TagAllQuestionsSchema, TagListSchema } from "../validations"

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    connectToDatabase()
    const allTags: unknown = await TagDocument.find({})
    const parsedAllTags = TagListSchema.parse(allTags)
    if (!parsedAllTags) {
      throw new Error('Tags not found')
    }
    return parsedAllTags
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getTopInteractedTags = async (params: GetTopInteractedTagsParams) => {
  try {
    // connectToDatabase()
    // const { userId, limit = 3 } = params
    // const allTags: unknown = await TagDocument.find(
    //   { creator: userId },
    //   { max: limit }
    // )
    // const parsedAllTags = TagsSchema.parse(allTags)
    // if (!parsedAllTags) {
    //   throw new Error('Tags not found')
    // }
    // return parsedAllTags
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getQuestionsByTagId = async (param: GetQuestionsByTagIdParams) => {
  try {
    connectToDatabase()
    const { tagId, page = 1, pageSize = 10, searchQuery } = param;
    let searchCmd = {}
    if (searchQuery) {
      searchCmd = { title: { $regex: new RegExp(searchQuery, "i") } }
    }
    const tagDetail: unknown = await TagDocument.findById(tagId)
      .populate({
        path: "questions",
        populate: [
          { path: "tags", select: "_id name" },
          { path: "author" },
        ],
        match: searchCmd,
        options: { sort: { createdAt: -1 }, skip: (page - 1) * pageSize, limit: pageSize },
      })
    const parsedResult = TagAllQuestionsSchema.safeParse(tagDetail);
    if (!parsedResult.success) {
      throw new Error("tag related questions not found");
    }
    return { name: parsedResult.data.name, questions: parsedResult.data.questions };
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const getPopularTags = async () => {
  try {
    connectToDatabase()
    const populatTags: unknown = await TagDocument.aggregate([
      { $limit: 5 },
      { $project: { name: 1, questionsNum: { $size: "$questions" }, followersNum: { $size: "$followers" } } },
      { $sort: { questionsNum: -1, followersNum: -1 } }
    ])
    const parsedResult = PopularTagListSchema.safeParse(populatTags);
    if (!parsedResult.success) {
      throw parsedResult.error;
    }
    return parsedResult.data;
  } catch (error) {
    console.log(error)
    throw error
  }
}