const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    email: {
        type:String,
        required:true
    },
    skills: {
        type: [String],
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{timestamps:true})

module.exports = mongoose.model("job",jobSchema)