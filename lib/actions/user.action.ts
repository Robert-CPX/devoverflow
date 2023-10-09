'use server'

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"

export const getUsereById = async (id: string) => {
  try {
    connectToDatabase()
    const user = await User.findOne({ clerkId: id })
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}