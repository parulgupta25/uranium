const reviewModel = require('../models/reviewModel');
const bookModel = require('../models/bookModel');
const mongoose = require('mongoose');

const validateRating = (rating) => {
    return /^[12345]$/.test(rating);
}

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

const createReview = async (req, res) => {
    try{
        const paramsId = req.params.bookId
        const requestBody = req.body

        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide review details' })
        }

        if (!isValidObjectId(paramsId)) {
            res.status(400).send({ status: false, message: `${paramsId} is not a valid book id` })
            return
        }

        let book = await bookModel.findOne({_id: paramsId, isDeleted: false}, {__v: 0});

        if (!book) {
            return res.status(404).send({ status: false, message: 'Book does not exist'})
        }

        // Extract params
        const { bookId, reviewedBy, reviewedAt, rating } = requestBody  //Object destructring

        // Validation starts
        if (!isValid(bookId)) {
            res.status(400).send({ status: false, message: 'bookId is required' })
            return
        }

        if(paramsId != bookId){
            res.status(400).send({ status: false, message: "Enter bookId same as pathId"})
        }

        if (!isValid(reviewedBy)) {
            res.status(400).send({ status: false, message: 'reviewed by is required' })
            return
        }

        if (!isValid(reviewedAt)) {
            res.status(400).send({ status: false, message: 'reviewed at is required' })
            return
        }
        
        if (!isValid(rating)) {
            res.status(400).send({ status: false, message: 'rating is required' })
            return
        }

        if(!validateRating(rating)){
            return res.status(400).send({
                status: false, message: "Please enter a rating, between 1 to 5 and in integer value only"
            })
        }
        // Validation ends

        const review = await reviewModel.create(requestBody);
        await bookModel.findByIdAndUpdate( bookId, {$inc: {reviews: 1}})

        const reviewsData = await reviewModel.find({ _id: review, isDeleted: false }, { bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        book = book.toObject()   //for adding the key in object
        book.reviewsData = reviewsData
        
        res.status(201).send({ status: true, message: 'Success', data: book });
    } 
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const updateReview = async (req, res) => {
    try{
        const paramsId = req.params.bookId
        const paramsReviewId = req.params.reviewId
        const requestBody = req.body

        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide review details' })
        }

        if (!isValidObjectId(paramsId)) {
            res.status(400).send({ status: false, message: `${paramsId} is not a valid book id` })
            return
        }

        const book = await bookModel.findById(paramsId);

        if (!book) {
            return res.status(404).send({ status: false, message: 'Book does not exist'})
        }

        if(book.isDeleted){
            return res.status(400).send({ status: false, message: 'Book has been deleted'})
        }

        if (!isValidObjectId(paramsReviewId)) {
            res.status(400).send({ status: false, message: `${paramsReviewId} is not a valid review id` })
            return
        }

        const findReview = await reviewModel.findById(paramsReviewId);

        if (!findReview) {
            return res.status(404).send({ status: false, message: 'Review does not exist'})
        }

        if(findReview.isDeleted){
            return res.status(400).send({ status: false, message: 'Review has been deleted'})
        }

        const { reviewedBy, rating, review } = requestBody
        if(reviewedBy){
            if (!isValid(reviewedBy)) {
                res.status(400).send({ status: false, message: 'reviewed by is not valid' })
                return
            }
        }
        
        if(rating){
            if (!isValid(rating)) {
                res.status(400).send({ status: false, message: 'rating is not valid' })
                return
            }
            if(!validateRating(rating)){
                return res.status(400).send({
                    status: false, message: "Please enter a rating, between 1 to 5 and in integer value only"
                })
            }
        }

        if(review){
            if(!isValid(review)){
                res.status(400).send({ status: false, message: 'review is not valid' })
                return
            }
        }
        const updatedReview = await reviewModel.findByIdAndUpdate( paramsReviewId, requestBody, { new: true })

        res.status(200).send({ status: true, message: 'Success', data: updatedReview });
    } 
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
} 

const deleteReview = async (req, res) => {
    try {
        const paramsId = req.params.bookId
        const paramsReviewId = req.params.reviewId

        if (!isValidObjectId(paramsId)) {
            res.status(400).send({ status: false, message: `${paramsId} is not a valid book id` })
            return
        }

        const book = await bookModel.findById(paramsId);

        if (!book) {
            return res.status(404).send({ status: false, message: 'Book does not exist'})
        }

        if(book.isDeleted){
            return res.status(400).send({ status: false, message: 'Book has been deleted'})
        }

        if (!isValidObjectId(paramsReviewId)) {
            res.status(400).send({ status: false, message: `${paramsReviewId} is not a valid review id` })
            return
        }

        const review = await reviewModel.findById(paramsReviewId);

        if (!review) {
            return res.status(404).send({ status: false, message: 'Review does not exist'})
        }

        if(review.isDeleted){
            return res.status(400).send({ status: false, message: 'Review has been deleted'})
        }

        const updatedReview = await reviewModel.findByIdAndUpdate( paramsReviewId, { isDeleted: true }, { new: true })

        await bookModel.findByIdAndUpdate( paramsId, {$inc: {reviews: -1}})

        res.status(200).send({ status: true, message: 'Success', data: updatedReview });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createReview, updateReview, deleteReview }