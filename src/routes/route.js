const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router()
const headerMiddleware = require('../middlewares/headerMiddleware')

const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const orderController = require('../controllers/orderController')

router.get("/test-me", function(req, res){
    res.send("My first ever api!")
})

router.post("/createUser", headerMiddleware.checkHeader, userController.createUser)
router.post("/createProduct", productController.createProduct)
router.post("/createOrder", headerMiddleware.checkHeader, orderController.createOrder)

module.exports = router;