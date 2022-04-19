const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router()
const authMiddlewares = require('../middlewares/authMiddlewares')

const userController = require('../controllers/userController')

router.get("/test-me", function(req, res){
    res.send("My first ever api!")
})

router.get("/basicRoute", authMiddlewares.mid1, authMiddlewares.mid2, authMiddlewares.mid3, userController.basicCode)

module.exports = router;