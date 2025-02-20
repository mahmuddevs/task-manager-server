import connectDB from "./db.config.js"

const db = await connectDB()

export const userCollection = db.collection('users')
export const taskCollection = db.collection('tasks')