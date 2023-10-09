'use server'

import UserDocument from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import { GetUserByIdParams } from "./shared"

export const getUsereById = async (param: GetUserByIdParams) => {
  try {
    connectToDatabase()
    const user = await UserDocument.findOne({ clerkId: param.userId })
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}