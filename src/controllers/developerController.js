const batchModel = require('../models/batchModel')
const developerModel = require('../models/developerModel')

const createDeveloper = async function(req, res){
    let developer = req.body
    let developerCreated = await developerModel.create(developer)
    res.send({data: developerCreated})
}

const fetchScholarshipDevelopers = async function(req, res){
    const getDeveloper = await developerModel.find({$and: [ {gender: "female"}, {percentage: {$gte: 70}} ]})
    res.send({data: getDeveloper})
}

const getDevelopers = async function(req, res){
    const findBatch = await batchModel.find({name: req.query.program})
    const getAllDeveloper = await developerModel.find({batch: findBatch, percentage: {$gte: req.query.percentage}}).populate('batch')
    res.send(findBatch)
}

module.exports.createDeveloper = createDeveloper
module.exports.fetchScholarshipDevelopers = fetchScholarshipDevelopers
module.exports.getDevelopers = getDevelopers