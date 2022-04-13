const bookModel = require("../models/bookModel")

const createBook = async function(req,res)
{
    let data = req.body
    let saveData = await bookModel.create(data)
    res.send({msg: saveData})
}

const bookList = async function(req,res){
    let allBooks = await bookModel.find().select({bookName: 1, authorName: 1, _id: 0})
    res.send({msg: allBooks})
}

const getBooksInYear = async function(req, res){
    let booksYear = await bookModel.find({year: req.body.year})
    res.send({msg: booksYear})
}

const getParticularBooks = async function(req, res){
    let condition = req.body
    let allBooks = await bookModel.find(condition)
    res.send({msg: allBooks})
}

const getXINRBooks = async function(req, res){
    let allBooks = await bookModel.find
    ({'price.indianPrice': {$in:["100INR", "200INR", "500INR"]}})
    // ({ $or: [ {'price.indianPrice': { $eq: "100INR"}}, {'price.indianPrice': { $eq: "200INR"}}, {'price.indianPrice': {$eq: "500INR"}} ]})
    res.send({msg: allBooks})
}

const getRandomBooks = async function(req, res){
    let allBooks = await bookModel.find({ $or: [ {stockAvailable: true}, {totalPages: { $gt: 500}} ]})
    res.send({msg: allBooks})
}

module.exports.createBook = createBook
module.exports.bookList = bookList
module.exports.getBooksInYear = getBooksInYear
module.exports.getParticularBooks = getParticularBooks
module.exports.getXINRBooks = getXINRBooks
module.exports.getRandomBooks = getRandomBooks