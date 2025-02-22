import express from 'express'
import { taskCollection } from '../db/db.collections.js'
import { ObjectId } from 'mongodb'

const taskRouter = express.Router()

//get tasks
taskRouter.get('/:userID', async (req, res) => {
    const { userID } = req.params
    try {
        const result = await taskCollection.find({ userID }).sort({ order: 1 }).toArray()
        return res.send(result)
    } catch (err) {
        console.log("Error Fetching Tasks")
        return res.status(500).send('Error Fetching Tasks')
    }
})

//add task
taskRouter.post('/', async (req, res) => {
    const data = req.body

    try {
        const lastTask = await taskCollection
            .find({ userID: data?.userID })
            .sort({ order: -1 })
            .limit(1)
            .toArray();

        console.log(lastTask)

        const newOrder = lastTask.length > 0 ? lastTask[0].order + 1 : 0;

        const newTask = {
            ...data,
            order: newOrder
        };


        const result = await taskCollection.insertOne(newTask)
        return res.send(result)
    } catch (err) {
        console.log("Error Adding Tasks")
        return res.status(500).send('Error Adding Tasks')
    }
})

//update task
taskRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const data = req.body;
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
        return res.status(500).send('Error Updating Tasks')
    }
})

//update state
taskRouter.patch('/update-state/:id', async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
    console.log(state)

    if (!state) {
        return res.status(400).send("State field is required");
    }

    try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: { state },
        };

        const options = { upsert: false };

        const result = await taskCollection.updateOne(filter, updateDoc, options);

        if (result.matchedCount === 0) {
            return res.status(404).send("Task not found");
        }

        return res.send({ message: "Task updated successfully", result });
    } catch (err) {
        console.log("Error updating task:", err);
        return res.status(500).send('Error updating task');
    }
})

// //update task order
// taskRouter.post('/tasks/update-order', async (req, res) => {
//     const { draggedTaskId, newState, newOrder, tasks } = req.body;

//     try {
//         if (draggedTaskId && newState && newOrder !== undefined) {
//             // Move task to another column (newState)
//             const task = await taskCollection.findOne({ _id: new ObjectId(draggedTaskId) });

//             // If the task doesn't exist, return 404
//             if (!task) {
//                 return res.status(404).send('Task not found');
//             }

//             // Update the task with the new column (newState) and the order (newOrder)
//             await taskCollection.updateOne(
//                 { _id: new ObjectId(draggedTaskId) },
//                 {
//                     $set: {
//                         state: newState,
//                         order: newOrder,
//                     },
//                 }
//             );

//             // Recalculate the order in the new column (target column)
//             const tasksInNewState = await taskCollection
//                 .find({ state: newState })
//                 .sort({ order: 1 })
//                 .toArray();

//             tasksInNewState.forEach(async (task, index) => {
//                 await taskCollection.updateOne(
//                     { _id: task._id },
//                     { $set: { order: index + 1 } }
//                 );
//             });

//             // Recalculate the order in the old column (source column)
//             const tasksInOldState = await taskCollection
//                 .find({ state: task.state })
//                 .sort({ order: 1 })
//                 .toArray();

//             tasksInOldState.forEach(async (task, index) => {
//                 await taskCollection.updateOne(
//                     { _id: task._id },
//                     { $set: { order: index + 1 } }
//                 );
//             });

//             res.json({ success: true });
//         } else if (tasks && Array.isArray(tasks)) {
//             // Reorder tasks within the same column
//             const updatedOrders = tasks.map((task, index) => ({
//                 ...task,
//                 order: index + 1,
//             }));

//             for (const updatedTask of updatedOrders) {
//                 await taskCollection.updateOne(
//                     { _id: new ObjectId(updatedTask._id) },
//                     { $set: { order: updatedTask.order } }
//                 );
//             }

//             res.json({ success: true });
//         } else {
//             res.status(400).send('Invalid request');
//         }
//     } catch (error) {
//         console.error("Error updating task order:", error);
//         res.status(500).send('Error updating task order');
//     }
// });


//delete task
taskRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    const query = { _id: new ObjectId(id) }
    try {
        const result = await taskCollection.deleteOne(query)
        return res.send(result)
    } catch (err) {
        console.log("Error Deleting Tasks")
        return res.status(500).send({ error: true }, 'Error Deleting Tasks')
    }
})

export default taskRouter



