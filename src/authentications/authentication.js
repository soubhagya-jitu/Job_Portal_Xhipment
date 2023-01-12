const jwt = require('jsonwebtoken')
const validation = require("../validations/validation")
const jobModel= require("../models/jobModel")
const applyModel = require("../models/applyModel")

const authentication = (req, res, next) => {
  try {
    let bearerHeader = req.headers.authorization;
    if (typeof bearerHeader == "undefined") return res.status(400).send({ status: false, message: "Token is missing" });

    let bearerToken = bearerHeader.split(' ')
    let token = bearerToken[1];
    jwt.verify(token, "Job_Portal_Xhipment", function (err, data) {
      if (err) {
        return res.status(400).send({ status: false, message: err.message })
      } else {
        req.decodedToken = data;
        next()
      }
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}

const authorization = async (req, res, next) => {
  try {
    let loggedInUser = req.decodedToken.userId
    let jobId = req.params.jobId

    if (!validation.isValidObjectId(jobId)) return res.status(400).send({ status: false, message: "Enter a valid jobId" })

    let findJob = await jobModel.findOne({_id:jobId,isDeleted:false})
    if (!findJob) return res.status(404).send({ status: false, message: "No job found" });

    let loginUser = findJob.userId.toString()

    if (loggedInUser != loginUser) return res.status(403).send({ status: false, message: "Error!! authorization failed" });
    next()
  } catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}

const authorization1 = async (req, res, next) => {
  try {
    let loggedInUser = req.decodedToken.userId
    let applyId = req.params.applyId

    if (!validation.isValidObjectId(applyId)) return res.status(400).send({ status: false, message: "Enter a valid applyId" })

    let findAppliedJob = await applyModel.findOne({_id:applyId,isDeleted:false})
    if (!findAppliedJob) return res.status(404).send({ status: false, message: "No job applied" });

    let loginUser = findAppliedJob.userId.toString()

    if (loggedInUser != loginUser) return res.status(403).send({ status: false, message: "Error!! authorization failed" });
    next()
  } catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}

module.exports = { authentication,authorization,authorization1 }