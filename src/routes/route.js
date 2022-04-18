const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const batchController = require("../controllers/batchController")
const developerController = require("../controllers/developerController")


router.get("/test-me", function(req, res){
    res.send("My first ever api!")
})

router.post('/createBatch', batchController.createBatch)

router.post('/createDeveloper', developerController.createDeveloper)

router.get('/get-scholarship-developers', developerController.fetchScholarshipDevelopers)

router.get('/get-developers', developerController.getDevelopers)

module.exports = router;