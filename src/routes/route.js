const express = require('express');
const req = require('express/lib/request');
const { route } = require('express/lib/application');
const randomController = require('../controllers/randomController')

const router = express.Router();

router.get('/missingNum', function(req, res){
    const arr = [1,2,4,5,6,7]
    let total = 0
    
    for (let i in arr) {
        const element = arr[i];
        total += element
    }

    const lastDigit = arr.pop()
    const consecutiveSum = lastDigit * (lastDigit+1) / 2
    const missingNumber = consecutiveSum - total

    res.send({data: missingNumber})
});

router.get('/missNum2', function(req, res){
    const arr = [33,34,35,37,38,39]
    const len = arr.length

    let total = 0
    for (let i in arr) {
        const element = arr[i];
        total += element
    }

    const firstDigit = arr[0]
    const lastDigit = arr.pop()
    const consecutiveSum = (len+1) *(firstDigit+lastDigit)/2
    const missingNumber = consecutiveSum - total

    res.send({data: missingNumber})
});

let players = [
    {
        "name": "manish",
        "dob": "1/1/1995",
        "gender": "male",
        "city": "jalandhar",
        "sports": [
            "swimming"
        ]
    },
    {
        "name": "gopal",
        "dob": "1/09/1995",
        "gender": "male",
        "city": "delhi",
        "sports": [
            "soccer"
        ],
    },
    {
        "name": "lokesh",
        "dob": "1/1/1990",
        "gender": "male",
        "city": "mumbai",
        "sports": [
            "soccer"
        ],
    },
]

router.post('/players', function(req, res){
    let x = req.body.name
    let newPlayer = req.body
    
    let flag = 0
    for (let index = 0; index < players.length; index++) {
        let element = players[index];
        let {name} = element
        if(x === name){
            flag = 1
            break
        }
    }
    if(flag === 0){
        players = [...players, newPlayer]
    }

    res.send( {data: players, status: true} )
});

router.post("/test-post2", randomController.addToArray);


module.exports = router;
// adding this comment for no reason