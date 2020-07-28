const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const Course = require('../models/Course')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/test', (req, res) => {
  res.send('instructor test')
})

router.post('/add-course', (req, res) => {
  console.log(req.body)
  const title = req.body.Title
  const description = req.body.Discription
  const learning = req.body.learning
  const targetStudent = req.body.TargetStudents
  const price = req.body.Price
  const sections = req.body.sections
  console.log(sections)
  const imageUrl = req.body.Image
  const user = {
    id: req.body.currentUser.currentUserId,
    username: req.body.currentUser.currentUsername,
  }

  const newCourse = {
    title: title,
    description: description,
    targetStudent: targetStudent,
    user: user,
    sections: sections,
    learning: learning,
    feeStructure: price,
    imageUrl: imageUrl,
  }

  Course.create(newCourse, function (err, newlyCreated) {
    if (err) {
      console.log(err)
    } else {
      console.log('added course')
    }
  })
})
module.exports = router
