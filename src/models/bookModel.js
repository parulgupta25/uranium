const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    bookName : {
        type : String,
        required : true
    },
    price: {
        indianPrice: String, europeanPrice: String
    },
    year: {type: Number, default: 2021},
    tags: [ String ],
    authorName : String,
    totalPages: Number,
    stockAvailable: Boolean
},{timestamp : true});

module.exports = mongoose.model('Book',bookSchema)