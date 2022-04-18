const authorModel = require('../models/authorModel')

const createNewAuthor = async function(req, res){
    let newAuthor = req.body
    let authorCreated = await authorModel.create(newAuthor)
    res.send({data: authorCreated})
}

module.exports.createNewAuthor = createNewAuthor