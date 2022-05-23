const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidTitle = (title) => {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValidRequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}

const createUser = async (req, res) => {
    try{
        const requestBody = req.body
        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
        }

        // Extract request body fields
        const { title, name, phone, email, password } = requestBody  //Object destructring

        // Validation starts
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: 'Title is required' })
        }

        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: `Title should be among ${['Mr', 'Mrs', 'Miss'].join(', ')}`})
        }

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Name is required' })
        }

        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: 'Phone is required' })
        }

        if (!(/^[6-9]\d{9}$/.test(phone))) {
            return res.status(400).send({ status: false, message: 'Phone should be valid mobile number' })
        }

        const isPhoneAlreadyUsed = await userModel.findOne({ phone });  //{phone : phone} object shorthand property

        if (isPhoneAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${phone} phone number is already registered` })
        }
        
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Email is required' })
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: 'Email should be valid email address' })
        }

        const isEmailAlreadyUsed = await userModel.findOne({ email });  //{email : email} object shorthand property

        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} email address is already registered` })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'Password is required' })
        }

        if(!(password.length >= 8) || !(password.length <= 15)){
            return res.status(400).send({
                status: false, message: "Password length must be between 8 to 15 char long"
            })
        }
        // Validation ends

        const newUser = await userModel.create(requestBody);

        res.status(201).send({ status: true, message: 'Success', data: newUser });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }

        // Extract request body fields
        const { email, password} = requestBody

        // Validation starts
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Email is required' })
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: 'Email should be valid email address' })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'Password is required' })
        }

        if(!(password.length >= 8) || !(password.length <= 15)){
            return res.status(400).send({
                status: false, message: "Password length must be between 8 to 15 char long"
            })
        }

        const user = await userModel.findOne({ email, password })

        if (!user) {
            return res.status(401).send({ status: false, message: 'Invalid login credentials' });
        }

        const token = jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) * 60 * 60 * 60
        }, 'Project-3')

        res.status(200).send({ status: true, message: 'Success', data: { token } });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createUser, loginUser }