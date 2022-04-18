const authorModel = require('../models/authorModel')
const bookModel = require('../models/bookModel')
const publisherModel = require('../models/publisherModel')

const createNewBook = async function(req, res){
    let book = req.body
    if(book.author && book.publisher){
        let a_check = await authorModel.find({_id: book.author}).select("_id")
        let p_check = await publisherModel.find({_id: book.publisher}).select("_id")
        if(!a_check.length && !p_check.length)
            res.send({msg: "Author and Publisher Id fields dosen't match our data, hence invalid"})
        else if(!a_check.length && p_check.length) 
            res.send({msg: "Author Id field dosen't match our data, hence invalid"})
        else if(a_check.length && !p_check.length)
            res.send({msg: "Publisher Id field dosen't match our data, hence invalid"})
        else {
            if(!await bookModel.exists(req.body)){
                let savedData= await bookModel.create(req.body)
                res.send({msg: savedData})
            } else res.send({msg: "This Book already exits in the collection"})
        }
    }else if(!book.author && book.publisher){
        res.send({Error: "AuthorId is required!"})
    }else if(book.author && !book.publisher){
        res.send({Error: "PublisherId is required!"})
    }else{
        res.send({Error: "AuthorId and PublisherId both are required!"})
    }
}

const getBooksWithAuthorDetailsAndPublisherDetails = async function(req, res){
    let books = await bookModel.find().populate('author').populate('publisher')
    res.send({data: books})
}

const updateBook = async function(req,res){
    let find_PId = await publisherModel.findOne({name: req.body.publisher}).select('_id')
    let data = await bookModel.updateMany(
                                        {publisher: find_PId},
                                        {$set: {isHardCover: true}}
                                        )
    res.send({msg: data})
}

const updateBookPrice = async (req,res) => {
    let data = await bookModel.updateMany(
                                        {rating: {$gt: 3.5}},
                                        {$inc: {price: 10}}
                                        )
    res.send({msg: data})
}

const updateB = async (req,res) => { 
    let a_filter = await authorModel.find({rating: {$gt: 3.5}})
    await bookModel.updateMany({author: a_filter}, {$inc: {price: 10}})
    let data = await bookModel.find({author:a_filter})
    res.send({msg: data})
}

module.exports.createNewBook = createNewBook
module.exports.getBooksWithAuthorDetailsAndPublisherDetails = getBooksWithAuthorDetailsAndPublisherDetails
module.exports.updateBook = updateBook
module.exports.updateBookPrice = updateBookPrice
module.exports.updateB = updateB
