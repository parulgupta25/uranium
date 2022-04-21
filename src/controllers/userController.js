const userModel = require("../models/userModel")

const createUser = async function(req, res){
    const user = req.body
    const header = req.headers
    const userCreated = await userModel.create(user)
    res.send({data: userCreated})
}

module.exports = {createUser}