const jobModel = require("../models/jobModel")
const validation = require("../validations/validation")


const createJob = async (req, res) => {
    try {
        let data = req.body;
        let userId = req.decodedToken.userId
        

        let { title, description, email, skills, experience } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "please provide  details" })

        data.userId = userId

        if (!validation.isValid(title)) return res.status(400).send({ status: false, message: "title is required" })

        if (!validation.isValid(description)) return res.status(400).send({ status: false, message: "description is required" })

        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        data.email = email.toLowerCase()

        if (!validation.isValid(skills)) return res.status(400).send({ status: false, message: "skills is required" })
        skills = skills.toLowerCase().split(",")
        data.skills = skills

        if (!validation.isValid(experience)) return res.status(400).send({ status: false, message: "experience is required" })

        let createJob = await jobModel.create(data)
        res.status(201).send({ status: true, message: "Successfully created", data: createJob })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

let getJob = async (req, res) => {
    try {
        data = req.query
        let { title,skills, experience, page } = data
        let conditions = { isDeleted: false, ...data }
        if (!page) {
            page = 1
        }
        if (skills) {
            conditions.skills = {}
            conditions.skills["$regex"] = skills
            conditions.skills['$options'] = 'i'
        }
        if (title) {
            conditions.title = {}
            conditions.title["$regex"] = title
            conditions.title['$options'] = 'i'
        }
        if (experience) {
            conditions.experience = {}
            //fetch document less than equal to the given experience year
            conditions.experience["$lte"] = experience
        }
        let getJob = await jobModel.find(conditions).sort({ experience: -1 }).skip(5 * (page - 1)).limit(5).select({createdAt:0,updatedAt:0,__v:0})
        if (getJob.length == 0) {
            return res.status(404).send({ status: false, message: "No job found" })
        }
        res.status(200).send({ status: true, data: getJob })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
const getJobByJobId = async (req, res) => {
    try {
        let jobId = req.params.jobId

        if (!validation.isValidObjectId(jobId)) return res.status(400).send({ status: false, message: "It should be a valid jobId" })
        let findJob = await jobModel.find({ _id: jobId, isDeleted: false }).select({createdAt:0,updatedAt:0,__v:0})
        if (!findJob.length) {
            return res.status(404).send({ status: false, message: "No job Found" })
        }
        res.status(200).send({ status: true, data: findJob })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const updateJob = async (req, res) => {
    try {
        let data = req.body
        let jobId = req.params.jobId
        let { email, skills } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "Provide required details to update" })

        if (email || email==="") {
            if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
            data.email = email.toLowerCase()
        }
        if (skills || skills=="") {
            if(skills.length==0) return res.status(400).send({status:false,message:"Enter a valid skill"})
            skills = skills.toLowerCase().split(",")
            data.skills = skills
        }

        let updateData = await jobModel.findOneAndUpdate({_id:jobId},{...data},{new:true}).select({createdAt:0,updatedAt:0,__v:0})
        return res.status(200).send(({status:true,message:"successfully updated",data:updateData}))

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const deleteJob = async (req, res) => {
    try {
        let jobId = req.params.jobId

        await jobModel.findOneAndUpdate({ _id: jobId }, { isDeleted: true })

        return res.status(200).send({ status: true, message: "successfully deleted" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createJob, getJob,getJobByJobId,deleteJob,updateJob }