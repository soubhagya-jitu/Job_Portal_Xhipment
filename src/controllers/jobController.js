const jobModel = require("../models/jobModel")
const validation = require("../validations/validation")


const createJob = async (req, res) => {
    try {
        let data = req.body;
        let userId = req.params.userId
        data.userId = userId

        let { title, description, email, skills, experience } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "please provide  details" })

        if (!validation.isValid(title)) return res.status(400).send({ status: false, message: "title is required" })

        if (!validation.isValid(description)) return res.status(400).send({ status: false, message: "description is required" })

        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        data.email=email.toLowerCase()

        if (!validation.isValid(skills)) return res.status(400).send({ status: false, message: "skills is required" })
        skills=skills.toLowerCase().split(",")
        data.skills=skills

        if (!validation.isValid(experience)) return res.status(400).send({ status: false, message: "experience is required" })

        let createJob = await jobModel.create(data)
        res.status(200).send({ status: false, message: "Successfully created", data: createJob })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

let getJob = async (req, res) => {
    try {
        data = req.query
        let { title, description, email, skills, experience,page } = data
        let conditions = { isDeleted: false,...data }
        if(!page) {
            page=1
        }
        if (skills) {
            conditions.skills = {}
            conditions.skills["$regex"] = skills
            conditions.skills['$options'] = 'i'
        }
        if(title) {
            conditions.title = {}
            conditions.title["$regex"] = title
            conditions.title['$options'] = 'i'
        }
        if(experience) {
            conditions.experience={}
            //fetch document lessthan equal to the given experience year
            conditions.experience["$lte"] = experience
        }
        if(email) {
            conditions.email=email.toLowerCase()
        }
        let getJob = await jobModel.find(conditions).sort({experience:-1}).skip(5 * (page-1)).limit(5)
        if (getJob.length == 0) {
            return res.status(200).send({ status: false, message: "There is no job with the given filter " })
        }
        res.status(200).send({ status: false, data: getJob })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createJob, getJob }