const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const Course = require('../models/Course')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/test', (req, res) => {
  res.send('instructor test')
})

router.get('/all-course', (req, res) => {
  // const userId = req.body.userId
  Course.find({ userId: req.body.id }, function (err, allCourse) {
    if (err) {
      console.log(err)
    } else {
      res.json(allCourse)
    }
  })
})

router.get('/all-course/:id', (req, res) => {
  const id = req.params.id
  Course.findById(id, function (err, allCourse) {
    if (err) {
      console.log(err)
    } else {
      res.json(allCourse)
    }
  })
})

router.post('/add-course', (req, res) => {
  console.log(req.body)
  const title = req.body.Title
  const description = req.body.Discription
  const learning = req.body.learning
  const targetStudent = req.body.TargetStudents
  const price = req.body.feeStructure
  const sections = req.body.sections
  // console.log(sections)
  const imageUrl = req.body.image
  const videoUrl = req.body.video
  const userId = req.body.currentUser.currentUserId
  const username = req.body.currentUser.currentUsername

  const newCourse = {
    title: title,
    description: description,
    targetStudent: targetStudent,
    userId: userId,
    username: username,
    sections: sections,
    learning: learning,
    feeStructure: price,
    imageUrl: imageUrl,
    videoUrl: videoUrl,
  }

  Course.create(newCourse, function (err, newlyCreated) {
    if (err) {
      console.log(err)
    } else {
      console.log('added course')
    }
  })
})

//update
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
module.exports = router
