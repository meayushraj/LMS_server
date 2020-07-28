const mongoose = require('mongoose')
const Schema = mongoose.Schema

var CourseSchema = new Schema({
  user: {
    id: {
      type: String,
    },
    username: {
      type: String,
    },
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
  targetStudent: {
    type: String,
  },
  feeStructure: {
    type: String,
    default: 'Free',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  sections: [
    {
      taskList: [
        {
          VideoName: String,
          VideoNumber: String,
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
})

module.exports = Course = mongoose.model('Course', CourseSchema)
