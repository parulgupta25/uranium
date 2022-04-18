const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const authorController = require("../controllers/authorController")
const bookController = require("../controllers/bookController")
const publisherController = require("../controllers/publisherController")

router.get("/test-me", function(req, res){
    res.send("My first ever api!")
})

router.post('/createNewAuthor', authorController.createNewAuthor)

router.post('/createNewPublisher', publisherController.createNewPublisher)

router.post("/createNewBook", bookController.createNewBook  )

router.get("/getBooksWithAuthorDetailsAndPublisherDetails", bookController.getBooksWithAuthorDetailsAndPublisherDetails)

router.put("/updateBook", bookController.updateBook)

router.put("/updateBookPrice", bookController.updateBookPrice)

router.put("/updateB", bookController.updateB)

module.exports = router;