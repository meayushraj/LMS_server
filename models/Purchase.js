const mongoose = require('mongoose')
const Schema = mongoose.Schema

var PurchaseSchema = new Schema({
  userId: {
    type: String,
  },
  userName: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  instructorId: {
    type: String,
  },
  instructorName: {
    type: String,
  },
  courseId: {
    type: String,
  },
  courseTitle: {
    type: String,
  },
  courseCost: {
    type: String,
  },
})

module.exports = Purchase = mongoose.model('Purchase', PurchaseSchema)