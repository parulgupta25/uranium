const axios = require("axios")
const { options } = require("../routes/route")

let getStates = async function(req, res){
    try{
        let options = {
            method: 'get', 
            url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states'
        }
        let result = await axios(options)
        let data = result.data
        console.log(data)
        res.status(200).send({msg: data, status: true})
    }catch(err){
        console.log(err)
        res.status(500).send({msg: err.message})
    }  
}

let getDistricts = async function(req, res){
    try{
        let id = req.params.stateId
        let options = {
            method: 'get',
            url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`
        }
        let result = await axios(options)
        let data = result.data
        console.log(data)
        res.status(200).send({msg: data, status: true})
    }catch(err){
        console.log(err)
        res.status(500).send({msg: err.message})
    }   
}

const findByPin = async function(req, res){
    try{
        let pin = req.query.pincode
        let date = req.query.date
        console.log(`query params are: ${pin} ${date}`)
        let options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`
        }
        let result = await axios(options)
        let data = result.data
        console.log(data)
        res.status(200).send({msg: data})
    }catch(err){
        console.log(err)
        res.status(500).send({msg: err.message})
    }   
}

let findByDistrict = async function(req, res){
    try{
        let districtId = req.query.district_id
        let date = req.query.date
        let options = {
            method: 'get',
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId}&date=${date}`
        }
        let result = await axios(options)
        let data = result.data
        console.log(data)
        res.status(200).send({msg: data})
    }catch(err){
        console.log(err)
        res.status(500).send({msg: err.message})
    }
}

let getOtp = async function(req, res){
    try{
        let getData = req.body
        console.log(`body is: ${getData}`)
        let options = {
            method: "post",
            url: 'https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP',
            data: getData
        }
        let result = await axios(options)
        let data = result.data
        console.log(data)
        res.status(200).send({msg: data})
    }catch(err){
        console.log(err)
        res.status(500).send({msg: err.message})
    } 
}

let getWeather = async function(req, res){
    try{
        let city = req.query.q
        let id = req.query.appid
        console.log(`body is: ${city} ${id}`)
        let options = {
            method: "post",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${id}`
        }
        let result = await axios(options)
        let data = result.data
        console.log(data)
        res.status(200).send({msg: data})
    }catch(err){
        console.log(err)
        res.status(500).send({msg: err.message})
    } 
}

let getTemp = async function(req, res){
    try{
        let city = req.query.q
        let id = req.query.appid
        console.log(`body is: ${city} ${id}`)
        let options = {
            method: "post",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${id}`
        }
        let result = await axios(options)
        let data = result.data.main.temp
        console.log(data)
        res.status(200).send({temp: data})
    }catch(err){
        console.log(err)
        res.status(500).send({msg: err.message})
    } 
}

let getSortedCities = async function(req, res){
    try{
        let cities = ["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
        let newCitiesArr = []
        for(const getcity of cities){
            let obj = {city: getcity}
            let options = {
                method: "get",
                url: `http://api.openweathermap.org/data/2.5/weather?q=${getcity}&appid=348cb6205db8cd0d673218bc7fe55bc2`
            }
            let result = await axios(options)
            let fetchtemp = result.data.main.temp
            console.log(fetchtemp)
            obj.temp = fetchtemp
            newCitiesArr.push(obj)
        }
        console.log(newCitiesArr)
        newCitiesArr.sort((a, b) => a.temp - b.temp)
        console.log(newCitiesArr)
        res.status(200).send({data: newCitiesArr})
    }catch(err){
        console.log(err)
        res.status(500).send({msg: err.message})
    } 
}

let getMemes = async function(req, res){
    try{
        let options = {
            method: 'get', 
            url: 'https://api.imgflip.com/get_memes'
        }
        let result = await axios(options)
        let data = result.data
        console.log(data)
        res.status(200).send(data)
    }catch(err){
        console.log(err)
        res.status(500).send({msg: err.message})
    }  
}

let createMeme = async function(req, res){
    try{
        let memeId = req.query.template_id
        let text0 = req.query.text0
        let text1 = req.query.text1
        let username = req.query.username
        let pass = req.query.password
        let options = {
            method: 'post', 
            url: `https://api.imgflip.com/caption_image?template_id=${memeId}&text0=${text0}&text1=${text1}&username=${username}&password=${pass}`
        }
        let result = await axios(options)
        let data = result.data
        res.status(200).send(data)
    }catch(err){
        console.log(err)
        res.status(500).send({msg: err.message})
    }  
}

module.exports = {getStates, getDistricts, findByPin, findByDistrict, getOtp, getWeather, getTemp, getSortedCities, getMemes, createMeme}