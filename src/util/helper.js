const curr_date = function printDate(){
    let now = new Date()
    let date = now.getDate()

    console.log(date)
} 

const curr_month = function printMonth(){
    let now = new Date()
    let month = now.getMonth()

    console.log(month)
}

const batch_info = function getBatchInfo(){
    console.log('Uranium, W3D3, the topic for today is Nodejs module system')
}

module.exports.currDate = curr_date
module.exports.currMonth = curr_month
module.exports.batchInfo = batch_info
