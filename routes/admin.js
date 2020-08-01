const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = process.env.JWT_SECRET
const bodyParser = require('body-parser')

const Admin = require('../models/Admin')
const Course = require('../models/Course')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/test', (req, res) => {
  res.send('admin test')
})

router.post('/register', (req, res) => {
  console.log(req.body)
  Admin.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email aldready exists' })
    } else {
      const newUser = new Admin({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
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

router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  Admin.findOne({ email }).then((user) => {
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

//approve the course
router.get('/all-course/permission', (req, res) => {
  Course.find({}, function (err, allCourse) {
    if (err) {
      console.log(err)
    } else {
      res.json(allCourse)
    }
  })
})

router.put('/all-course/:id/permission', (req, res) => {
  Course.findByIdAndUpdate(req.params.id, req.body, function (
    err,
    updatedCourse
  ) {
    if (err) {
      res.send(err)
    } else {
      res.send('updated !')
    }
  })
})

module.exports = router
