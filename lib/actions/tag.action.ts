'use server'

import TagDocument from "@/database/tag.model"
import { connectToDatabase } from "../mongoose"
import { GetTopInteractedTagsParams } from "./shared"
import { TagsSchema } from "../validations"
import { ObjectId } from 'mongodb'

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