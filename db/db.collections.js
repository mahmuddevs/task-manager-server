import connectDB from "./db.config.js"

const db = connectDB()

export const userCollection = db.collection('users')