const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

const Course = require("../models/Course")

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get("/test", (req, res) => {
  res.send("instructor test")
})

router.post("/add-course", (req, res) => {
  const title = req.body.title
  const description = req.body.Discription
  const requirments = req.body.Prerequisites
  const targetStudent = req.body.TargetStudents
  const user = {
    id: req.body.currentUser.currentUserId,
    username: req.body.currentUser.currentUsername
  }

  const newCourse = {
    title: title,
    description: description,
    requirments: requirments,
    targetStudent: targetStudent,
    user: user
  }

  Course.create(newCourse, function (err, newlyCreated) {
    if (err) {
      console.log(err)
    } else {
      res.send("course added!")
    }
  })
})
module.exports = router
