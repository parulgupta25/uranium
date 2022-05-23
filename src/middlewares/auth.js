const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');

const authentication = (req, res, next) => {
    try {
        let token = req.headers['x-api-key'] || req.headers['x-Api-key']

        if (!token) {
            res.status(401).send({ status: false, message: 'Missing authentication token in request' })
        }

        const decoded = jwt.verify(token, 'Project-3')

        if (!decoded) {
            res.status(401).send({ status: false, message: 'Invalid authentication token in request' })
            return
        }
        next()
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const authorisation = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "Project-3");

        let usersId = decodedToken.userId
        let bodyData = req.body.userId
        let booksId = req.params.bookId

        if (bodyData) {
            if (!mongoose.isValidObjectId(bodyData)) return res.status(400).send({ status: false, message: "The userId is Invalid" })
            let checkUser = await userModel.findById(bodyData)
            if (!checkUser) return res.status(400).send({ status: false, message: "UserId Not Found" })
            if (usersId != bodyData) {
                return res.status(403).send({ status: false, message: "UnAuthorized Access!!" })
            }
        }

        if (booksId) {
            if (!mongoose.isValidObjectId(booksId)) return res.status(400).send({ status: false, message: "The BookId is Invalid." })
            let checkBookData = await bookModel.findOne({ _id: booksId, isDeleted: false })
            if (!checkBookData) return res.status(400).send({ status: false, message: "BookId Not Found" })
            let checkBook = await bookModel.findOne({ _id: booksId, userId: usersId })
            if (!checkBook) {
                return res.status(403).send({ status: false, message: "UnAuthorized Access!!" })
            }
        }
        next()
    }
    catch (error) {
        return res.status(500).send({status: false, message: error.message })
    }
}

module.exports = { authentication, authorisation }