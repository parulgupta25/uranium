const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://parul_gupta05:8tIPaevO6ZCErmDA@cluster0.jlp5k.mongodb.net/Parul-db?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use(
    function(req, res, next){
        let today = new Date()
        let year = today.getFullYear()
        let month = today.getMonth() + 1
        let date = today.getDate()

        let hours = addZero(today.getHours())
        let minutes = addZero(today.getMinutes())
        let seconds = addZero(today.getSeconds())

        function addZero(num){ 
            return num < 10 ? `0${num}` : num
        }

        let fetchRoute = req.path
        let fetchIP = req.ip
        console.log(`${year}-${month}-${date} ${hours}:${minutes}:${seconds}, ${fetchIP}, ${fetchRoute}`)
        next()
    }
)

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
  
  