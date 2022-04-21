const checkHeader = async function(req, res, next){
    const header = req.headers.isfreeappuser
    if(header){
        if(header === "true")
        req.body.isFreeAppUser = true
        if(header === "false")
        req.body.isFreeAppUser = false
        next()
    }else{
        res.send({msg: "request is missing a mandatory header!"})
    }
}

module.exports.checkHeader = checkHeader
