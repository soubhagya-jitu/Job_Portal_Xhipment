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
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: "user"
    },
    jobId: {
        type: ObjectId,
        ref: "job"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("appliedJob", applyJobSchema)