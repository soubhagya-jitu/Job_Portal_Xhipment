const express = require("express")
const router = express.Router()
let {authentication,authorization,authorization1} = require("../authentications/authentication")
let {createUser,loginUser} = require("../controllers/userController")
let {createJob,getJob,getJobByJobId,updateJob,deleteJob} = require("../controllers/jobController")
let {applyJob,getAppliedJob,getAppliedJobByApplyId,applicantsByJobId,updateAppliedJob,deleteAppliedJob} = require("../controllers/applyController")

router.post("/register",createUser)
router.post("/login",loginUser)

router.post("/createJob",authentication,createJob)
router.get("/getJob",authentication,getJob)
router.get("/getJob/:jobId",authentication,getJobByJobId)
router.put("/updateJob/:jobId",authentication,authorization,updateJob)
router.delete("/deleteJob/:jobId",authentication,authorization,deleteJob)

router.post("/applyJob/:jobId",authentication,applyJob)
router.get("/getAppliedJob",authentication,getAppliedJob)
router.get("/getAppliedJob/:applyId",authentication,getAppliedJobByApplyId)
router.get("/applicants/:jobId",authentication,applicantsByJobId)
router.put("/updateAppliedJob/:applyId",authentication,authorization1,updateAppliedJob)
router.delete("/deleteAppliedJob/:applyId",authentication,authorization1,deleteAppliedJob)


router.all("/*/", async function (req, res){

    res.status(404).send({status:false, msg: "Wrong url"})
})

module.exports = router