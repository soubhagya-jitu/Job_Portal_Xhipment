const userModel = require("../models/userModel")
const validation = require("../validations/validation")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {
    try {
        let data = req.body;
        let { firstName, lastName, email, phone, password } = data

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "Provide all required  details" })

        if (!validation.isValid(firstName)) return res.status(400).send({ status: false, message: "first name is required" })
        if (!validation.isValidName(firstName)) return res.status(400).send({ status: false, message: "Not a valid firstname" })

        if (!validation.isValid(lastName)) return res.status(400).send({ status: false, message: "lastname is required" })
        if (!validation.isValidName(lastName)) return res.status(400).send({ status: false, message: "Not valid lastname" })


        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) return res.status(409).send({ status: false, msg: "This email already used" })
        data.email=email.toLowerCase()

        if (!validation.isValid(phone)) return res.status(400).send({ status: false, message: "Phone is required" })
        if (!validation.isValidPhone(phone)) return res.status(400).send({ status: false, message: "Phone number is not valid" })
        let checkPhone = await userModel.findOne({ phone: phone })
        if (checkPhone) return res.status(409).send({ status: false, msg: "This phone no already used" })


        if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Password is required" })
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
      if (!findUser) return res.status(400).send({ status: false, message: "The email-id is wrong" })
  
      let bcryptPass = await bcrypt.compare(password, findUser.password)
      if (!bcryptPass) return res.status(400).send({ status: false, message: "Password incorrect" })
  
      let token = jwt.sign({ userId: findUser._id }, "Job_Portal_Xhipment", { expiresIn: '1d' });
  
      res.status(200).send({ status: true, message: "User login successfully", data: { userId: findUser._id, token: token } })
  
  
    } catch (error) {
      res.status(500).send({ status:false, error: error.message })
    }
  }


module.exports = {createUser,loginUser}