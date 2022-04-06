const trim_str = function trimString(){
    const str = "   Hi my name is    Parul.    "
    console.log(str.trim())
}

const lower_case = function changetoLowerCase(){
    const str = "HI my nAmE is Parul."
    console.log(str.toLowerCase())
}

const upper_case = function changetoUpperCase(){
    const str = "Hi my name is Parul."
    console.log(str.toUpperCase())
}

module.exports.trim = trim_str
module.exports.lowerCase = lower_case
module.exports.upperCase = upper_case