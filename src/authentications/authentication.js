const jwt = require('jsonwebtoken')
const validation = require("../validations/validation")

const authentication = (req, res, next) => {
  try {
    let bearerHeader = req.headers.authorization;
    if (typeof bearerHeader == "undefined") return res.status(400).send({ status: false, message: "Token is missing" });

    let bearerToken = bearerHeader.split(' ')
    let token = bearerToken[1];
    jwt.verify(token, "Job_Portal_Xhipment", function (err, data) {
      if (err) {
        return res.status(400).send({ status: false, message: err.message })
      } else {
        req.decodedToken = data;
        next()
      }
    });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}

const authorization = async (req, res, next) => {
  try {
    let loggedInUser = req.decodedToken.userId
    let userId = req.params.userId

    if (!validation.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter a valid user Id" })

    let findUser = await userModel.findById(userId)
    if (!findUser) return res.status(404).send({ status: false, message: "User not found" });

    let loginUser = findUser._id.toString()

    if (loggedInUser !== loginUser) return res.status(403).send({ status: false, message: "Error!! authorization failed" });
    next()
  } catch (err) {
    res.status(500).send({ status: false, error: err.message })
  }
}

module.exports = { authentication,authorization }