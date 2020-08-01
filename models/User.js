const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  sex: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  language: {
    type: String,
  },
  fieldOfIntrest: {
    type: String,
  },
  instructor: {
    type: String,
    default: '',
  },
  resetLink: {
    data: String,
    default: '',
  },
  purchasedCourse: [
    {
      courseId: String,
    },
  ],
})

// UserSchema.plugin(passportLocalMongoose)

module.exports = User = mongoose.model('User', UserSchema)
