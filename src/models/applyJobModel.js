const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const applyJobSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    coverletter: {
        type: String
    },
    userId: {
        type: ObjectId,
        ref: "users"
    },
    jobId: {
        type: ObjectId,
        ref: "jobs"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("appliedJob", applyJobSchema)