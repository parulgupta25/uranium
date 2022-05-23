const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const reviewModel = require('../models/reviewModel');
const mongoose = require('mongoose');
const aws = require('aws-sdk')

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidRequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}

aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: '2006-03-01' });

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
        
    })
}

const createBook = async (req, res) => {
    try {
        const requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide books details' })
        }

        // Extract params
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt, bookCover } = requestBody  //Object destructring

        // Validation starts
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: 'Title is required' })
        }

        const isTitleAlreadyUsed = await bookModel.findOne({ title });  //{title : title} object shorthand property

        if (isTitleAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${title} title is already registered` })
        }

        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: 'Excerpt is required' })
        }

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: 'User id is required' })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(400).send({ status: false, message: 'User does not exist' })
        }

        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: 'ISBN is required' })
        }

        if (!/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN)) {
            return res.status(400).send({ status: false, message: 'Please provide a valid ISBN' })
        }

        const isISBNAlreadyUsed = await bookModel.findOne({ ISBN });  //{ISBN : ISBN} object shorthand property

        if (isISBNAlreadyUsed) {
            res.status(400).send({ status: false, message: `${ISBN} ISBN is already registered` })
            return
        }

        if (!isValid(category)) {
            res.status(400).send({ status: false, message: 'category is required' })
            return
        }

        if (!isValid(subcategory)) {
            res.status(400).send({ status: false, message: 'subcategory is required' })
            return
        }

        if (!isValid(releasedAt)) {
            res.status(400).send({ status: false, message: 'release date is required' })
            return
        }

        if (!/((\d{4}[-])(\d{2}[-])(\d{2}))/.test(releasedAt)) {
            return res.status(400).send({ status: false, message: 'Please provide a valid Date(YYYY-MM-DD)' })
        }
        // Validation ends

        let files = req.files
        if (!files && files.length > 0) return res.status(400).send({ status: false, message: "No file found" })
        let uploadedFileURL = await uploadFile(files[0])

        const finalBookData= JSON.parse(JSON.stringify(requestBody))
        finalBookData.bookCover=uploadedFileURL

        const newBook = await bookModel.create(finalBookData)

        res.status(201).send({ status: true, message: "Book created successfully", data: newBook })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const getBooksByQuery = async (req, res) => {
    try {
        const filterQuery = { isDeleted: false }
        const queryParams = req.query

        if (isValidRequestBody(queryParams)) {
            const { userId, category, subcategory } = queryParams

            if (isValid(userId)) {
                if (!isValidObjectId(userId)) {
                    return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
                }
                filterQuery['userId'] = userId
            }

            if (isValid(category)) {
                filterQuery['category'] = category
            }

            if (isValid(subcategory)) {
                filterQuery['subcategory'] = subcategory
            }
        }

        const books = await bookModel.find(filterQuery).collation({ locale: "en" }).sort({ title: 1 }).select("title excerpt userId category reviews releasedAt");

        if (!isValidRequestBody(books)) {
            return res.status(404).send({ status: false, message: 'No books found' })
        }

        return res.status(200).send({ status: true, message: 'Books list', data: books })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getBooks = async (req, res) => {
    try {
        const bookId = req.params.bookId
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        }

        const book = await bookModel.findOne({ _id: bookId, isDeleted: false }, { __v: 0 });
        if (!book) {
            return res.status(404).send({ status: false, message: 'Book does not exist' })
        }

        const reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }, { isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        const data = book.toObject()
        data['reviewsData'] = reviewsData

        res.status(200).send({ status: true, message: 'Success', data: data })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const updateBook = async (req, res) => {
    try {
        const requestBody = req.body
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
            return
        }

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide book details for updation' })
        }

        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });

        if (!book) {
            return res.status(404).send({ status: false, message: 'Book does not exist' })
        }

        // Extract request body fields 
        const { title, excerpt, releasedAt, ISBN } = requestBody

        if (title) {
            if (!isValid(title)) {
                return res.status(400).send({ status: false, message: `title is not valid` })
            }

            const isTitleAlreadyUsed = await bookModel.findOne({ title });  //{title : title} object shorthand property   
            if (isTitleAlreadyUsed) {
                return res.status(400).send({ status: false, message: `${title} title is already registered` })
            }
        }

        if (excerpt) {
            if (!isValid(excerpt)) {
                res.status(400).send({ status: false, message: 'Excerpt is not valid' })
                return
            }
        }

        if (releasedAt) {
            if (!isValid(releasedAt)) {
                return res.status(400).send({ status: false, message: 'release date is required' })
            }

            if (!/((\d{4}[-])(\d{2}[-])(\d{2}))/.test(releasedAt)) {
                return res.status(400).send({ status: false, message: 'Please provide a valid Date(YYYY-MM-DD)' })
            }
        }

        if (ISBN) {
            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, message: 'ISBN is not valid' })
            }

            if (!/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN)) {
                return res.status(400).send({ status: false, message: 'Please provide a valid ISBN' })
            }

            const isISBNAlreadyUsed = await bookModel.findOne({ ISBN });  //{ISBN : ISBN} object shorthand property
            if (isISBNAlreadyUsed) {
                res.status(400).send({ status: false, message: `${ISBN} ISBN is already registered` })
                return
            }
        }

        const updatedBook = await bookModel.findByIdAndUpdate(bookId, requestBody, { new: true })

        res.status(200).send({ status: true, message: 'Success', data: updatedBook });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
            return
        }

        const book = await bookModel.findOne({ _id: bookId, isDeleted: false });

        if (!book) {
            return res.status(404).send({ status: false, message: 'Book not found' })
        }

        await bookModel.findByIdAndUpdate(bookId, { isDeleted: true, deletedAt: new Date() }, { new: true })

        res.status(200).send({ status: true, message: 'Success' });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createBook, getBooksByQuery, getBooks, updateBook, deleteBook }