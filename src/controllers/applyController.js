const applyModel = require("../models/applyModel")
const aws = require("../aws/aws")
const validation = require("../validations/validation")
const { findOneAndDelete } = require("../models/applyModel")
const { findOneAndUpdate } = require("../models/jobModel")


const applyJob = async (req, res) => {
    try {
        let data = req.body
        let userId = req.decodedToken.userId
        let jobId = req.params.jobId

        let { name, email } = data
        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "provide all the required details" })

        data.userId = userId
        data.jobId = jobId

        let findJob = await applyModel.findOne({ userId: userId, jobId: jobId })
        if (findJob) {
            return res.status(400).send({ status: false, message: "You have already applied for the job" })
        }

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

        if (!files[1]) {
            return res.status(400).send({ msg: "No coverleteer found" })
        }
        let uploadCoverletter = await aws.uploadFile(files[1])
        data.coverletter = uploadCoverletter

        const applyJob = await applyModel.create(data)
        res.status(201).send({ status: true, message: "successfully applied for the job", data: applyJob })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getAppliedJob = async (req, res) => {
    try {
        let userId = req.decodedToken.userId
        let page = parseInt(req.query.page)
        if (!page) {
            page = 1
        }
        const findAppliedJob = await applyModel.find({ userId: userId, isDeleted: false }).skip(5 * (page - 1)).limit(5).select({ createdAt: 0, updatedAt: 0, __v: 0 })
        if (!findAppliedJob.length) {
            return res.status(400).send({ status: false, message: "No applied job found" })
        }
        return res.status(200).send({ status: true, data: findAppliedJob })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getAppliedJobByApplyId = async (req, res) => {
    try {
        let userId = req.decodedToken.userId
        let applyId = req.params.applyId
        if (!validation.isValidObjectId(applyId)) return res.status(400).send({ status: false, message: "It should be a valid applyId" })
        const findAppliedJob = await applyModel.find({ userId: userId, _id: applyId, isDeleted: false }).select({ createdAt: 0, updatedAt: 0, __v: 0 })
        if (!findAppliedJob.length) {
            return res.status(200).send({ status: true, message: "No job Found " })
        }
        res.status(200).send({ status: true, data: findAppliedJob })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const applicantsByJobId = async (req, res) => {
    try {
        let jobId = req.params.jobId
        let page = req.query.page
        if (!page) {
            page = 1
        }
        if (!validation.isValidObjectId(jobId)) return res.status(400).send({ status: false, message: "It should be a valid jobId" })
        const findApplicants = await applyModel.find({ jobId: jobId, isDeleted: false }).skip(5 * (page - 1)).limit(5).select({ createdAt: 0, updatedAt: 0, __v: 0 })
        if (!findApplicants.length) {
            return res.status(200).send({ status: true, message: "No applicants for this job" })
        }
        res.status(200).send({ status: true, data: findApplicants })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const updateAppliedJob = async (req, res) => {
    try {
        let applyId = req.params.applyId
        let data = req.body
        let { name, email } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "provide the required details for updation" })

        if (name) {
            if (!validation.isValidName(name)) return res.status(400).send({ status: false, message: "name is not valid" })
        }
        if (email) {
            if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
            data.email = email.toLowerCase()
        }

        let files = req.files
        if (files.length) {
            if (files[0].fieldname == "resume") {
                let uploadResume = await aws.uploadFile(files[0])
                data.resume = uploadResume
            } else {
                let uploadCoverletter = await aws.uploadFile(files[0])
                data.coverletter = uploadCoverletter
            }
            if (files[1]) {
                    let uploadCoverletter = await aws.uploadFile(files[1])
                    data.coverletter = uploadCoverletter
            }
        }
        const updateAppliedJob = await applyModel.findOneAndUpdate({ _id: applyId }, { ...data }, { new: true })
        res.status(200).send({ status: true, message: "Successfully updated ", data: updateAppliedJob })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const deleteAppliedJob = async (req, res) => {
    try {
        let applyId = req.params.applyId

        await applyModel.findOneAndUpdate({ _id: applyId }, { isDeleted: true })
        return res.status(200).send({ status: true, message: "successfully deleted" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { applyJob, getAppliedJob, getAppliedJobByApplyId, applicantsByJobId, updateAppliedJob, deleteAppliedJob }