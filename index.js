import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import userRouter from './routes/users.js'
import connectDB from './db/db.config.js'
import taskRouter from './routes/tasks.js'


const app = express()
const port = process.env.PORT || 3001

//middlewares
app.use(cors())
app.use(express.json())


//routes
app.use('/users', userRouter)
app.use('/tasks', taskRouter)

app.get('/', (req, res) => {
    res.send('hello world')
})

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`listening to port ${port}`)
        })
    }).catch(console.dir)