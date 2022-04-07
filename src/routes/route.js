const express = require('express');
const logger = require('../logger/logger')
const util = require('../util/helper')
const validator = require('../validator/formatter')
const _ = require('lodash');
const req = require('express/lib/request');
const { route } = require('express/lib/application');

const router = express.Router();

router.get('/test-me', function (req, res) {
    
    logger.welcome()
    util.currDate()
    util.currMonth()
    util.batchInfo()
    validator.trim()
    validator.lowerCase()
    validator.upperCase()

    res.send('My first ever api!')
});

router.get('/all-candidates', function(req, res){
    const arr = ['Parul', 'Akku', 'Bhawna', 'Aishu', 'Aayu', 'Sneha', 'Simmi', 'Pankaj', 'Muzammil', 'Pranshu']

    res.send(arr)
});

router.get('/candidates', function(req, res){
    const arr = ['Parul', 'Akku', 'Bhawna', 'Aishu', 'Aayu', 'Sneha', 'Simmi', 'Pankaj', 'Muzammil', 'Pranshu']


    let newArr = []
    console.log(req.query)
    for(let i=0; i<req.query.count; i++){
        newArr.push(arr[i])
    }
    res.send(newArr)
});

router.get('/user-profile/:userName', function(req, res){
    console.log(req.params.userName)
    res.send('dummy response')
});

router.get('/hello', function (req, res){
    str = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const splitArray =  _.chunk(str, 3)
    console.log(splitArray)
    
    const array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    console.log(_.tail(array))

    const unionofArrays = _.union([2, 4], [1, 2], [6,4,2,8], [2,7,5,9], [1,0,6]);
    console.log(unionofArrays)

    const frompair =  _.fromPairs([['horror', 'The Shining'], ['drama', 'Titanic'], ['thriller', 'Shutter Island'], ['fantasy', 'Pans Labyrinth']]);
    console.log(frompair)

    res.send('My second ever api!')
});

router.get('/movies', function(req, res){
    const arr = ['rand de basnasti', 'the shining', 'lord of the rings', 'bartman begins']


    res.send(arr)
});

router.get('/movies/:indexNumber', function(req, res){
    const arr = ['rand de basnasti', 'the shining', 'lord of the rings', 'bartman begins']

    if(req.params.indexNumber>=arr.length){
        res.send('ERROR: Use a valid index')
    }
    res.send(arr[req.params.indexNumber])
});

router.get('/films', function(req, res){
    const movieArr = [ {
        'id': 1,
        'name': 'The Shining'
       }, {
        'id': 2,
        'name': 'Incendies'
       }, {
        'id': 3,
        'name': 'Rang de Basanti'
       }, {
        'id': 4,
        'name': 'Finding Nemo'
       }]
       
       res.send(movieArr)
});

module.exports = router;
// adding this comment for no reason