const express = require('express')

require('./db/mongoose')
const User = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

//Indica a express que use formato json
app.use(express.json())  
app.post('/users', (req, res) => {
    console.log('Received: '+req.body)
    const user = new User(req.body)

    user.save().then( () => {
        res.send(user)
    }).catch(error => {
        console.log("error", error.message)
        res.send(error)
    })
})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})