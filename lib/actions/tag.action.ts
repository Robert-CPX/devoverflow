'use server'

import TagDocument from "@/database/tag.model"
import { connectToDatabase } from "../mongoose"
import { GetAllTagsParams, GetQuestionsByTagIdParams } from "./shared"
import { PopularTagListSchema, TagAllQuestionsSchema, TagListSchema } from "../validations"

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    connectToDatabase()
    const { page = 1, pageSize = 10, filter, searchQuery } = params
    const skipAmount = (page - 1) * pageSize;
    let searchCmd = {}
    if (searchQuery) {
      searchCmd = { name: { $regex: new RegExp(searchQuery, "i") } }
    }
    let filterCmd = {}
    switch (filter) {
      case 'popular': filterCmd = { followers: -1 }; break;
      case 'recent': filterCmd = { createdAt: -1 }; break;
      case 'name': filterCmd = { name: 1 }; break;
      case 'old': filterCmd = { createdAt: 1 }; break;
    }
    const allTags: unknown = await TagDocument.find(searchCmd, null, { skip: skipAmount, limit: pageSize, sort: filterCmd })
    const parsedAllTags = TagListSchema.parse(allTags)
    if (!parsedAllTags) {
      throw new Error('Tags not found')
    }
    const totalCount = await TagDocument.countDocuments(searchCmd)
    const isNext = (skipAmount + parsedAllTags.length) < totalCount;
    return { allTags: parsedAllTags, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getUserTags = async (params: GetAllTagsParams) => {
  try {
    connectToDatabase()
    const { page = 1, pageSize = 3, searchQuery } = params
    let searchCmd = {}
    if (searchQuery) {
      searchCmd = { creator: searchQuery }
    }
    const allTags: unknown = await TagDocument.find(searchCmd, null, { skip: (page - 1) * pageSize, limit: pageSize })
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
        options: { sort: { createdAt: -1 }, skip: (page - 1) * pageSize, limit: pageSize + 1 },
      })
    const parsedResult = TagAllQuestionsSchema.safeParse(tagDetail);
    if (!parsedResult.success) {
      throw new Error("tag related questions not found");
    }
    const isNext = parsedResult.data.questions.length > pageSize;
    return { name: parsedResult.data.name, questions: parsedResult.data.questions, isNext };
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