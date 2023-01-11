const express = require("express")
const router = express.Router()
let {createUser,loginUser} = require("../controllers/userController")
let {createJob,getJob} = require("../controllers/jobController")
let {authentication} = require("../authentications/authentication")
let {applyJob,getAppliedJob,getAppliedJobByJobId} = require("../controllers/applyJobController")

router.post("/register",createUser)
router.post("/login",loginUser)

router.post("/createJob/:userId",authentication,createJob)
router.get("/getJob",authentication,getJob)

router.post("/applyJob/:userId/:jobId",authentication,applyJob)
router.get("/getAppliedJob/",authentication,getAppliedJob)
router.get("/getAppliedJob/:jobId",authentication,getAppliedJobByJobId)











router.all("/*/", async function (req, res){

    res.status(404).send({status:false, msg: "Wrong url"})
})

module.exports = router