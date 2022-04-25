const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router()

const cowinController = require('../controllers/cowinController')

router.get("/test-me", function(req, res){
    res.send("My first ever api!")
})

router.get("/getStates", cowinController.getStates)

router.get("/getDistricts/:stateId", cowinController.getDistricts)

router.get("/findByPin", cowinController.findByPin)

router.get("/findByDistrict", cowinController.findByDistrict)

router.post("/getOtp", cowinController.getOtp)

router.get("/getWeather", cowinController.getWeather)

router.get("/getTemp", cowinController.getTemp)

router.get("/getSortedCities", cowinController.getSortedCities)

router.get("/getMemes", cowinController.getMemes)

router.post("/createMeme", cowinController.createMeme)

module.exports = router;