const basicCode = async function(req, res){

    
    // const headerData = req.headers.token
    // console.log(headerData)
    // console.log("HEADER DATA ABOVE")
    // console.log("Hey man, congrats you have reached the Handler")
    res.send({msg: "This is coming from controller (handler)"})
}



module.exports = {basicCode}