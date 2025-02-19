import express from 'express'

const userRouter = express.Router()

userRouter.get('/', (req, res) => {
    res.send('workin user route')
})

export default userRouter