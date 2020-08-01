const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const passportLocalMongoose = require("passport-local-mongoose")

var AdminSchema = new Schema({
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
})

// UserSchema.plugin(passportLocalMongoose)

module.exports = Admin = mongoose.model('Admin', AdminSchema)
