const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user-router')
const taskRouter = require('./routers/task-router')

const app = express()
const port = process.env.PORT


app.use(express.json())  // Points to Express to use a json format
app.use(userRouter)  // Use the user endpoints
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is running on port ' + port)
})

