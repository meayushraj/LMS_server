const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = process.env.JWT_SECRET
const bodyParser = require('body-parser')

const Admin = require('../models/Admin')
const User = require('../models/User')
const Course = require('../models/Course')
const Categories = require('../models/Categories')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/test', (req, res) => {
  res.send('admin test')
})

router.post('/add-categories', (req, res) => {
  const CategoriesTitle = req.body.Categories
  const CategoriesImage = req.body.CategoriesImage

  const newCategorie = {
    Categories: CategoriesTitle,
    CategoriesImage: CategoriesImage,
  }

  // console.log(newCategorie)
  Categories.create(newCategorie, function (err, newCat) {
    if (err) {
      console.log(err)
    } else {
      console.log('categorie added')
    }
  })
})

router.get('/get-categories', (req, res) => {
  Categories.find({}, function (err, allCategories) {
    if (err) {
      console.log(err)
    } else {
      res.json(allCategories)
    }
  })
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
  Course.find({ approved: false }, function (err, allCourse) {
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

//add admin course
router.post('/add-course', (req, res) => {
  // console.log(req.body)
  const title = req.body.title
  const description = req.body.description
  const learning = req.body.learning
  const targetStudent = req.body.targetStudent
  const prerequisites = req.body.prerequisites
  const feeStructure = req.body.feeStructure
  const price = req.body.Price
  console.log(price)
  const sections = req.body.sections
  console.log(sections)
  const imageUrl = req.body.image
  const videoUrl = req.body.video
  const userId = req.body.currentUser.currentUserId
  const username = req.body.currentUser.currentUsername

  const date = new Date().toISOString().split('T')[0]

  const newCourse = {
    adminCourse: true,
    approved: true,
    title: title,
    description: description,
    targetStudent: targetStudent,
    userId: userId,
    username: username,
    sections: sections,
    learning: learning,
    feeStructure: feeStructure,
    price: price,
    imageUrl: imageUrl,
    videoUrl: videoUrl,
    prerequisites: prerequisites,
    date: date,
  }

  // console.log(newCourse)

  Course.create(newCourse, function (err, newlyCreated) {
    if (err) {
      console.log(err)
    } else {
      console.log('added course')
    }
  })
})

//update admin course
router.put('/all-course/:id', (req, res) => {
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

//delete course
router.delete('/all-course/:id', (req, res) => {
  Course.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err)
    } else {
      res.send('deleted course')
    }
  })
})

//get admins all course
router.get('/all-course', (req, res) => {
  Course.find({ adminCourse }, function (err) {
    if (err) {
      res.send(err)
    } else {
      res.send('deleted course')
    }
  })
})

//get all user
router.get('/all-user', (req, res) => {
  User.find({ adminCourse: true }, function (err, allCourse) {
    if (err) {
      console.log(err)
    } else {
      res.json(allCourse)
    }
  })
})

module.exports = router
