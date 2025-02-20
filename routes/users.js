import express from 'express'
import { userCollection } from '../db/db.collections.js'

const userRouter = express.Router()

//Get User Data
userRouter.get('/:email', async (req, res) => {
    const { email } = req.params
    try {
        const result = await userCollection.findOne({ email })
        return res.send(result)
    } catch (err) {
        console.log("Error Fetching User")
        return res.status(500).send('Error Fetching User')
    }
})

//Add user data
userRouter.post('/add', async (req, res) => {
    const data = req.body
    try {
        const existing = await userCollection.findOne({ email: data?.email })
        if (existing) {
            return res.send({ existing: true })
        }

        const result = await userCollection.insertOne({ ...data })
        return res.send(result)

    } catch (err) {
        console.log("Error Adding User")
        return res.status(500).send('Error Adding User')
    }
})



export default userRouter