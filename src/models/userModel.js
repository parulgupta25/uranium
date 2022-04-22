const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobile: String,
    emailId: String,
    password: String,
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    age: Number
}, {timestamp : true});

module.exports = mongoose.model('user', userSchema)