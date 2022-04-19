
const mid1 = function(req, res, next){
    req.falana = "hi there I am adding something new to the req object"
    console.log(req.falana)
    next()
    // let loggedIn = true
    // if(loggedIn === true){
    //     next()
    // }else{
    //     res.send("Please login or Register")
    // }
}

const mid2 = function(req, res, next){
    console.log("Hi I am a middleware name Mid2")
    next()
}

const mid3 = function(req, res, next){
    console.log("Hi I am a middleware name Mid3")
    next()
}

module.exports = {mid1, mid2, mid3}