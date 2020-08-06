const mongoose = require('mongoose')
const Schema = mongoose.Schema

var CourseSchema = new Schema({
  permission: {
    type: String,
    default: 'Pending',
  },
  adminCourse: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
  },
  username: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  learning: {
    type: String,
  },
  prerequisites: {
    type: String,
  },
  targetStudent: {
    type: String,
  },
  feeStructure: {
    type: String,
    default: 'Free',
  },
  price: {
    type: String,
    default: null,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  sections: [
    {
      taskList: [
        {
          VideoName: String,
          VideoNumber: String,
          VideoURL: String,
        },
      ],
      SectionTitle: {
        type: String,
      },
      count: {
        type: Number,
      },
    },
  ],
  date: {
    type: String,
  },
})

module.exports = Course = mongoose.model('Course', CourseSchema)
