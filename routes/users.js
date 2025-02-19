import express from 'express'
import { userCollection } from '../db/db.collections.js'

const userRouter = express.Router()

userRouter.get('/add', async (req, res) => {
    const data = req.body
    try {
        const existing = await userCollection.findOne({ email: data?.email })
        if (existing) {
            return res.send({ existing: true })
        }

        const result = await userCollection.insertOne({ ...data })

    } catch (err) {
        console.log("Error Adding User")
        return res.status(500).send('Error Adding User')
    }
})

export default userRouter