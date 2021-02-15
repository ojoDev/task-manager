const mongoose = require('mongoose')
const validator = require('validator').default
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (validator.contains(value ,'password')) {
             throw new Error('Invalid password.')
            }
         }
    },
    email: {
        type: String,
        unique: true,   // email is unique. Is impossible create two users with the same email.
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
           if (!validator.isEmail(value)) {
            throw new Error('Email is invalid.')
           }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number.')
            }
        }

    },
    tokens: [ {
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true   // Add the fields createdAt and updatedAt
})

// Virtual property: represents the relationship into database
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {  // convert all the responses
    const user = this
    const userObject = user.toObject()  // mongoose useful method
    delete userObject.password
    delete userObject.tokens
    delete userObject.__v
    delete userObject.avatar
    return userObject
}


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat( {token})
    await user.save()

    return token
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email})

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


// Pre hook function, executed before mongoose "save" to encrypt password
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


// Delete user tasks when user is deleted
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany( {owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User