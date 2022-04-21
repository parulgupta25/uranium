const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: {
        type: Number,
        required: true
    }
}, {timestamp: true});

module.exports = mongoose.model('product', productSchema)