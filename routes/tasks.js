import express from 'express'
import { taskCollection } from '../db/db.collections.js'
import { ObjectId } from 'mongodb'

const taskRouter = express.Router()

//get tasks
taskRouter.get('/:userID', async (req, res) => {
    const { userID } = req.params
    try {
        const result = await userCollection.find({ userID }).toArray()
        return res.send(result)
    } catch (err) {
        console.log("Error Fetching Tasks")
        return res.status(500).send({ error: true }, 'Error Fetching Tasks')
    }
})

//add task
taskRouter.post('/', async (req, res) => {
    const data = req.body
    try {
        const result = await userCollection.insertOne({ ...data })
        return res.send(result)
    } catch (err) {
        console.log("Error Adding Tasks")
        return res.status(500).send({ error: true }, 'Error Adding Tasks')
    }
})

//update task
taskRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const data = req.body
    try {
        const filter = { _id: new ObjectId(id) }
        const updateDoc = {
            $set: { ...data },
        }

        const options = { upsert: true }

        const result = await taskCollection.updateOne(filter, updateDoc, options)
        return res.send(result)
    } catch (err) {
        console.log("Error Updating Tasks")
        return res.status(500).send({ error: true }, 'Error Updating Tasks')
    }
})

//delete task
taskRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    const query = { _id: new ObjectId(id) }
    try {
        const result = await userCollection.deleteOne(query)
        return res.send(result)
    } catch (err) {
        console.log("Error Deleting Tasks")
        return res.status(500).send({ error: true }, 'Error Deleting Tasks')
    }
})

export default taskRouter