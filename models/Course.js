const mongoose = require("mongoose")
const Schema = mongoose.Schema

var CourseSchema = new Schema({
  user: {
    id: {
      type: String
    },
    username: {
      type: String
    }
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  requirments: {
    type: String
  },
  targetStudent: {
    type: String
  }
})

module.exports = Course = mongoose.model("Course", CourseSchema)
