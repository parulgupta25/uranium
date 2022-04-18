const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    author_name: String,
    age: Number,
    address: String,
    rating: Number
},{timestamp : true});

module.exports = mongoose.model('newAuthor', authorSchema)