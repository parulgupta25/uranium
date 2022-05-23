const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const auth = require("../middlewares/auth")

// USER API
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

// BOOK API
router.post("/books", auth.authentication, auth.authorisation, bookController.createBook);
router.get("/books", auth.authentication, bookController.getBooksByQuery);
router.get("/books/:bookId", auth.authentication, bookController.getBooks);
router.put("/books/:bookId", auth.authentication, auth.authorisation, bookController.updateBook);
router.delete("/books/:bookId", auth.authentication, auth.authorisation, bookController.deleteBook);

// REVIEW API
router.post("/books/:bookId/review", reviewController.createReview);
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)

module.exports = router;
