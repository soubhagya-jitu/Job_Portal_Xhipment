const applyJobModel = require("../models/applyJobModel")
const aws = require("../aws/aws")
const validation = require("../validations/validation")


const applyJob = async (req, res) => {
    try {
        let data = req.body
        let userId = req.params.userId
        let jobId = req.params.jobId
        let { name, email } = data
        data.userId = userId
        data.jobId = jobId


        let findJob = await applyJobModel.findOne({ userId: userId, jobId: jobId })
        if (findJob) {
            return res.status(400).send({ status: false, message: "You already applied for the job" })
        }

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "provide all the required details" })

        if (!validation.isValid(name)) return res.status(400).send({ status: false, message: "namee is required" })
        if (!validation.isValidName(name)) return res.status(400).send({ status: false, message: "name is not valid" })

        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        data.email = email.toLowerCase()

        let files = req.files

        if (files[0].fieldname !== "resume") {
            return res.status(400).send({ msg: "No resume found" })
        }
        let uploadResume = await aws.uploadFile(files[0])
        data.resume = uploadResume

        if (files[1]) {
            let uploadCoverletter = await aws.uploadFile(files[1])
            data.coverletter = uploadCoverletter
        }

        const applyJob = await applyJobModel.create(data)
        res.status(201).send({ status: true, message: "successfully applied for the job", data: applyJob })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getAppliedJob = async (req, res) => {
    try {
        let userId = req.decodedToken.userId
        let page = parseInt(req.query.page)
        if(!page) {
            page=1
        }
        const findAppliedJob = await applyJobModel.find({ userId: userId,isDeleted:false }).skip(5 * (page-1)).limit(5)
        if (!findAppliedJob.length) {
            return res.status(400).send({ status: false, message: "You have not applied for any job" })
        }
        return res.status(200).send({ status: true, data: findAppliedJob })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getAppliedJobByJobId = async (req, res) => {
    try {
        let userId = req.decodedToken.userId
        let jobId = req.params.jobId
        if(!page) {
            page=1
        }
        if (!validation.isValidObjectId(jobId)) return res.status(400).send({ status: false, message: "It should be a valid jobId" })
        const findAppliedJob = await applyJobModel.find({ userId: userId,jobId: jobId,isDeleted:false }).skip(5 * (page-1)).limit(5)
        if (!findAppliedJob.lengthb) {
            return res.status(200).send({ status: true, message: "No job Found " })
        }
        res.status(200).send({ status: true, data: findAppliedJob })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { applyJob, getAppliedJob, getAppliedJobByJobId }