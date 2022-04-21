const userModel = require("../models/userModel")
const productModel = require('../models/productModel')
const orderModel = require('../models/orderModel')

const createOrder = async function(req, res){
    const order = req.body
    const freeUser = req.headers.isFreeAppUser
    if(!order.userId || !order.productId){
        res.send("orderId and purchaseId are required")
    }
    let userBalance = await userModel.findOne({_id: order.userId}).select('balance')
    let productPrice = await productModel.findOne({_id: order.productId}).select('price')

    if(!freeUser && userBalance.balance >= productPrice.price){
        let newBalance = userBalance.balance - productPrice.price
        let orderData = await orderModel.create({
            userId: order.userId,
            productId: order.productId,
            amount: productPrice.price,
            isFreeAppUser: false
        })
        await userModel.findOneAndUpdate({_id: req.body.userId}, {balance: newBalance})
        res.send({data: orderData})
    }

    if(!freeUser && userBalance.balance < productPrice.price){
        return res.send({msg: "doesn't have enough balance"})
    }

    if(freeUser){
        let orderData = await order.create({
            userId: req.body.userId,
            productId: req.body.productId,
            amount: 0,
            isFreeAppUser: true
        })
        res.send({data: orderData})
    }
}

module.exports = {createOrder}
