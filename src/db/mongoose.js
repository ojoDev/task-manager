const mongoose = require('mongoose')


console.log('Stablish connection')
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    usefindAndModify: false
})
console.log('Connection ok')
