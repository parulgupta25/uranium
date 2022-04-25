const authCheck = async function(req, res, next){
    try{
        let id = req.params.userId
        if(!mongoose.isValidObjectId(req.params.userId)){
            return res.status(401).send({msg: "Invalid UserId sent in Params"})
        } 
        let token = req.headers['x-Auth-Token'] || req.headers['x-auth-token']
        if(!token) return res.status(401).send({msg: 'Token is required to verify log in credentials. Please send it.'}) 
        let tokenValidity = jwt.verify(token, "FunctionUp")
        if(tokenValidity.userId !== id) return res.status(401).send({msg: "This user hasn't been Authorised"}) 
        next()
    }
    catch(err){
        console.log(err.message)
        res.status(401).send({status: false, msg: 'invalid token, unable to verify session. Please re-log in.'}) 
    }
}

module.exports.authCheck = authCheck
