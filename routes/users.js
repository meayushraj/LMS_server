const express = require("express")
const User = require("../models/User")
const passport = require("passport")
const router = express.Router()
const bodyParser = require("body-parser")
var validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const keys = process.env.JWT_SECRET

//module
const Course = require("../models/Course")

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.get("/", (req, res) => {
  res.send("vaishanv")
})

router.get("/register", (req, res) => {
  res.send("register page")
})

router.get("/login", (req, res) => {
  res.send("login")
})

router.post("/login", (req, res) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "user not found" })
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          username: user.username,
          email: user.email
        }

        jwt.sign(payload, keys, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          })
        })
      } else {
        return res.status(400).json({ password: "password incorrect" })
      }
    })
  })
})

router.post("/register", (req, res) => {
  console.log(req.body)
  // console.log(req.body)
  // res.send(req.body)
  // if (validator.isEmail(req.body.email)) {
  //   const email = req.body.email
  // } else {
  //   res.send("email is not valid")
  // }
  // var newUser = new User({ username: req.body.username, email: req.body.email })
  // User.register(newUser, req.body.password, function (err, user) {
  //   if (err) {
  //     console.log(err)
  //     res.send("error")
  //   }
  //   passport.authenticate("local")(req, res, function () {
  //     res.send("good")
  //   })
  // })
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email aldready exists" })
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.log(err)
          }
          newUser.password = hash
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err))
        })
      })
    }
  })
})

//get all courese
router.get("/all-course", (req, res) => {
  Course.find({}, function (err, allCourse) {
    if (err) {
      console.log(err)
    } else {
      res.json(allCourse)
    }
  })
})

//current user
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user)
  }
)

module.exports = router
