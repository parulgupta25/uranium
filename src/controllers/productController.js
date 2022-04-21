const productModel = require('../models/productModel')

const createProduct = async function(req, res){
    const product = req.body
    const productCreated = await productModel.create(product)
    res.send({data: productCreated})
}

module.exports = {createProduct}