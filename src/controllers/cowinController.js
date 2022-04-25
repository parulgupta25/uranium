const axious = require("axios")

let getStates = function(req, res){
    let res = axios.get('')
    let data = res.data
    console.log(data)
    res.send(data)
}

module.exports = {getStates}