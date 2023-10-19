'use server'

import TagDocument from "@/database/tag.model"
import { connectToDatabase } from "../mongoose"
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared"
import { TagAllQuestionsSchema, TagListSchema } from "../validations"

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

/*
  TODO:
  priority: questions, followers | questions*60% + followers*40%
 */
export const getPopularTags = async () => {
  try {
    connectToDatabase()
    const allTags: unknown = await TagDocument.find({}, null, { limit: 5, sort: { followers: -1 } })
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