const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const createUser = async function(req, res){
    const user = req.body
    const userCreated = await userModel.create(user)
    res.send({data: userCreated})
}

const loginUser = async function(req, res){
    let userName = req.body.emailId
    let password = req.body.password

    let user = await userModel.findOne({emailId: userName, password: password})
    if(!user){
        return res.send({
            status: false,
            msg: "username or password is not correct"
        })
    }
    let token = jwt.sign({
        userId: user._id.toString(),
        batch: "thorium",
        organisation: "FunctionUp"
    },
    "functionup-thorium")
    res.setHeader("x-Auth-Token", token)
    res.send({status: true, data: token})
}

const getUserData = async function(req, res){
    let userData = await userModel.findById(req.params.userId)
    if(!userData){
        return res.send({msg: "User doesn't exist in DB."})
    }
    if(!userData.isDeleted){
        return res.send({status: true, data: userData})
    }

    res.send({msg: "can not access user as it is deleted"})

}
const updateUser = async function (req, res) {
    
      let userId = req.params.userId;
      let user = await userModel.findById(userId);
      if (!user) {
        return res.send("No such user exists");
      }
    
      let userData = req.body;
      let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, {new: true}, userData);
      res.send({ status: updatedUser, data: updatedUser });
};

const deleteUser = async function (req, res) {
    
    let userId = req.params.userId;
    let user = await userModel.findById(userId);
    if (!user) {
      return res.send("No such user exists");
    }
  
    let userData = req.body;
    let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, {isDeleted: false}, {new: true});
    res.send({ status: updatedUser, data: updatedUser });
};
module.exports = {createUser, loginUser, getUserData, updateUser, deleteUser}