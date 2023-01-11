const express = require("express")
const route = require("./routes/route")
const mongoose = require("mongoose")
const multer = require("multer")
const { query } = require("express")
const app = express()

let upload = multer()
app.use(express.json())
app.use(upload.any())

mongoose.connect("mongodb+srv://manaskumar:iFVJhjYrsH7iars8@cluster0.s4pqkzd.mongodb.net/Job_Portal?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))

app.use("/",route)

app.listen(3000,()=>{
    console.log("app is running on port 3000")
})


// EJ4KIu13ZtiSduad