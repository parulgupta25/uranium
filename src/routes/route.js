const express = require('express');
const logger = require('../logger/logger')
const util = require('../util/helper')
const validator = require('../validator/formatter')
const _ = require('lodash');

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

module.exports = router;
// adding this comment for no reason