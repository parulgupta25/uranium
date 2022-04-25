const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const createUser = async function(req, res){
    try{
        let user = req.body
        if(!await userModel.exists(user)){
            const userCreated = await userModel.create(user)
            res.status(201).send({data: userCreated})
            console.log("user create")
        }
        else{
            res.send({msg: "This user already exists."})
        }
    }catch(err){
        res.status(204).send({msg: err.message})
        console.log("user not create")
    }
}

const loginUser = async function(req, res){
    try{
        let userName = req.body.emailId
        let password = req.body.password

        let user = await userModel.findOne({emailId: userName, password: password})
        if(!user){
            return res.status(404).send({
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
        res.status(202).send({status: true, data: token})
    }catch(err){
        res.status(500).send({Error: err.message})
    }
}

const getUserData = async function(req, res){
    try{
        let userData = await userModel.findById(req.params.userId)
        if(!userData){
            return res.send({msg: "User doesn't exist in DB."})
        }
        if(!userData.isDeleted){
            return res.status(202).send({status: true, data: userData})
        }
        res.status(404).send({msg: "can not access user as it is deleted"})
    }catch(err){
        res.status(500).send({Error: err.message})
    }
}

const updateUser = async function (req, res) {
    try{
        let userId = req.params.userId;
        let user = await userModel.findById(userId);
        if (!user) {
            return res.status(204).send("No such user exists");
        }
        
        let userData = req.body;
        let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, {new: true}, userData);
        res.status(201).send({ status: updatedUser, data: updatedUser });
    }catch(err){
        res.status(500).send({Error: err.message})
    }  
};

const deleteUser = async function (req, res) {
    try{
        let userId = req.params.userId;
        let user = await userModel.findById(userId);
        if (!user) {
        return res.status(204).send("No such user exists");
        }
    
        let userData = req.body;
        let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, {isDeleted: true}, {new: true});
        res.status(200).send({ status: updatedUser, data: updatedUser });
    }catch(err){
        res.status(500).send({Error: err.message})
    } 
};

module.exports = {createUser, loginUser, getUserData, updateUser, deleteUser}