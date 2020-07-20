const express = require("express")
const User = require("../models/User")
const passport = require("passport")
const router = express.Router()
const bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))
router.get("/", (req, res) => {
  res.send("vaishanv")
})

router.get("/register", (req, res) => {
  res.send("register page")
})

router.get("/login", (req, res) => {
  res.send("login")
})

router.post(
  "/login",
  passport.authenticate("local", {
    successFlash: "Welcome!",
    failureFlash: "Invalid username or password."
  }),
  (req, res) => {}
)

router.post("/register", (req, res) => {
  // console.log(req.body)
  // res.send(req.body)
  var newUser = new User({ username: req.body.username, email: req.body.email })
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err)
      res.send("error")
    }
    passport.authenticate("local")(req, res, function () {
      res.send("good")
    })
  })
})

router.get("/logout", function (req, res) {
  req.logout()
  // res.clearCookie()
  res.send("logout")
})

module.exports = router
