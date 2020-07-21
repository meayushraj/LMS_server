const mongoose = require("mongoose")
const Schema = mongoose.Schema
// const passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true
  },
  password: String
})

// UserSchema.plugin(passportLocalMongoose)

module.exports = User = mongoose.model("User", UserSchema)
