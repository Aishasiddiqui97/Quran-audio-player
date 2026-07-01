import mongoose from "mongoose"
import { config } from "./env"

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(config.mongoUri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection error:`, error)
    process.exit(1)
  }
}
