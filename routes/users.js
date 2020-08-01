const express = require('express')
const User = require('../models/User')
const passport = require('passport')
const router = express.Router()
const bodyParser = require('body-parser')
const queryString = require('query-string')
var url = require('url')
const querystring = require('querystring')
var validator = require('validator')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = process.env.JWT_SECRET
const sgmail = require('@sendgrid/mail')

sgmail.setApiKey(process.env.SG_MAIL_API)

// const { forgotPassword, resetPassword } = require("../services/forgotPassword")
//module
const Course = require('../models/Course')
const Purchase = require('../models/Purchase')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.get('/', (req, res) => {
  res.send('vaishanv')
})

router.get('/register', (req, res) => {
  console.log(req.body)
})

router.get('/login', (req, res) => {
  res.send('login')
})

router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: 'user not found' })
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          username: user.username,
          email: user.email,
        }

        jwt.sign(payload, keys, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token,
          })
        })
      } else {
        return res.status(400).json({ password: 'password incorrect' })
      }
    })
  })
})

router.post('/register', (req, res) => {
  console.log(req.body)
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email aldready exists' })
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        age: req.body.formValues.Age,
        sex: req.body.formValues.sex,
        location: req.body.formValues.location,
        language: req.body.formValues.language,
        fieldOfIntrest: req.body.formValues.FieldOfInterest,
        instructor: req.body.formValues.instructor,
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
router.get('/all-course', (req, res) => {
  Course.find({ approved: true }, function (err, allCourse) {
    if (err) {
      console.log(err)
    } else {
      res.json(allCourse)
    }
  })
})

//forgetPassword route
router.put('/forgot-password', (req, res) => {
  const email = req.body.email
  console.log(111)
  console.log(email)
  console.log(222)

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'User not found' })
    }

    const token = jwt.sign({ _id: user.id }, keys, { expiresIn: '10m' })
    const data = {
      to: email,
      from: 'jackfrostvaishanav@gmai.com',
      subject: 'Account Password Reset Link',
      html: `
            <h2>Please Click the below link to reset your account Password</h2>
            <a href=${process.env.CLIENT_URL}/user/reset-password/${token}>reset link<a>
        `,
    }

    return user.updateOne({ resetLink: token }, function (err, success) {
      if (err) {
        return res.status(400).json({ error: 'Reset password Link error' })
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
})

router.put('/reset-password/:id', (req, res) => {
  const data = req.body
  const resetLink = req.params.id
  if (resetLink) {
    jwt.verify(resetLink, keys, function (error, decodedData) {
      if (error) {
        return res.status(401).json({
          error: 'incorret token',
        })
      }

      User.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({ error: 'User not found' })
        }

        const newUser = {
          password: data.newPassword,
          resetLink: '',
        }

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err)
            }
            newUser.password = hash
            user = _.extend(user, newUser)
            user
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err))
            console.log(newUser.password)
          })
        })

        // user.save((err, result) => {
        //   if (err) {
        //     return res.status(400).json({ error: "User not found" })
        //   } else {
        //   }
        // })
      })
    })
  } else {
    return res.status(400).json({ error: 'Authentication error' })
  }
})

//purchase course //
router.post('/course/buy', (req, res) => {
  console.log(req.body)
  const userId = req.body.studentdetails.id
  const username = req.body.studentdetails.username
  const userEmail = req.body.studentdetails.email
  const instructorId = req.body.instructordetails.instructorid
  const instructorName = req.body.instructordetails.instrucctorname
  const courseId = req.body.coursedetails.courseid
  const courseTitle = req.body.coursedetails.courseTitle
  const courseCost = req.body.cost_in_dollar

  const newPurchase = {
    userId: userId,
    userName: username,
    userEmail: userEmail,
    instructorId: instructorId,
    instructorName: instructorName,
    courseId: courseId,
    courseTitle: courseTitle,
    courseCost: courseCost,
  }

  try {
    Purchase.create(newPurchase, function (err, newlyCreated) {
      if (err) {
        console.log(err)
      } else {
        console.log('purchase completed')
      }
    })
  } catch (e) {
    console.log(e)
  }
})

//get purchased course
router.get('/my-course', (req, res) => {
  const userId = req.body.userId
  Purchase.find({ userId: userId }, function (err, allPurchased) {
    if (err) {
      console.log(err)
    } else {
      res.json(allPurchased)
    }
  })
})

//current user
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send(req.user)
  }
)

module.exports = router
