const express = require("express")
const route = require("./routes/route")
const mongoose = require("mongoose")

const app = express()

mongoose.connect("mongodb+srv://soubhagyasamal:O1ZONFTEBTkwE5Hn@cluster0.jfc6003.mongodb.net/Job_Portal_Xhipment?retryWrites=true&w=majority",{useNewUrlParser:true})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))

app.get("/",route)

app.listen(3000,()=>{
    console.log("app is running on port 3000")
})