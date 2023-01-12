const userModel = require("../models/userModel")
const validation = require("../validations/validation")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {
    try {
        let data = req.body;
        let { firstName, lastName, email, phone, password } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "please provide  details" })

        if (!validation.isValid(firstName)) return res.status(400).send({ status: false, message: "first name is required" })
        if (!validation.isValidName(firstName)) return res.status(400).send({ status: false, message: "not a valid firstname" })

        if (!validation.isValid(lastName)) return res.status(400).send({ status: false, message: "lastname is required" })
        if (!validation.isValidName(lastName)) return res.status(400).send({ status: false, message: "lastname is not valid" })


        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) return res.status(409).send({ status: false, msg: "email already exist" })
        data.email=email.toLowerCase()

        if (!validation.isValid(phone)) return res.status(400).send({ status: false, message: "phone is required" })
        if (!validation.isValidPhone(phone)) return res.status(400).send({ status: false, message: "phone number is not valid" })
        let checkPhone = await userModel.findOne({ phone: phone })
        if (checkPhone) return res.status(409).send({ status: false, msg: "Phone already exist" })


        if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Pasworrd is required" })
        if (!validation.isValidPwd(password)) return res.status(400).send({ status: false, message: "Password length should be 8 to 15 characters with atleast one uppercase , number and special character" })

        const saltRounds = 10
        const hash = bcrypt.hashSync(password, saltRounds)
        data.password = hash

        let createUser = await userModel.create(data)
        res.status(201).send({ status: true,message: "Successfully created", data:createUser })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const loginUser = async function (req, res) {
    try {
      let data = req.body
      let { email, password } = data

      if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "provide all  details to login" })
  
      if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
      email=email.toLowerCase()

      if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Pasworrd is required" })
  
      let findUser = await userModel.findOne({ email: email })
      if (!findUser) return res.status(400).send({ status: false, message: "the email id entered is wrong" })
  
      let bcryptPass = await bcrypt.compare(password, findUser.password)
      if (!bcryptPass) return res.status(400).send({ status: false, message: "Not a correct password" })
  
      let token = jwt.sign({ userId: findUser._id }, "Job_Portal_Xhipment", { expiresIn: '1d' });
  
      res.status(200).send({ status: true, message: "User login successfully", data: { userId: findUser._id, token: token } })
  
  
    } catch (error) {
      res.status(500).send({ status:false, error: error.message })
    }
  }


module.exports = {createUser,loginUser}