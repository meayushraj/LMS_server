const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")
const keys = process.env.JWT_SECRET
const sgmail = require("@sendgrid/mail")

sgmail.setApiKey(process.env.SG_MAIL_API)

exports.forgotPassword = (req, res) => {
  const { email } = req.body
  console.log(111)
  console.log(email)

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User not found" })
    }

    const token = jwt.sign({ _id: user.id }, keys, { expiresIn: "10m" })
    const data = {
      to: email,
      from: "jackfrostvaishanav@gmai.com",
      subject: "Account Password Reset Link",
      html: `
            <h2>Please Click the below link to reset your account Password</h2>
            <a href=${process.env.CLIENT_URL}/resetpassword/?token=${token}>reset link<a>
        `
    }

    return user.updateOne({ resetLink: token }, function (err, success) {
      if (err) {
        return res.status(400).json({ error: "Reset password Link error" })
      } else {
        sgmail.send(data).then(
          () => {},
          (error) => {
            console.error(error)

            if (error.response) {
              console.error(error.response.body)
            }
          }
        )
      }
    })
  })
}

exports.resetPassword = (req, res) => {
  const { newPassword } = req.body
  console.log(newPassword)
  console.log(req.query.token)
  // const reset_token = new URLSearchParams(url).get(
  //   "reset_token"
  // )
  // console.log(reset_token)
}
