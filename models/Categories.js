const mongoose = require('mongoose')
const Schema = mongoose.Schema

var CategoriesSchema = new Schema({
  Categories: {
    type: String,
  },
  CategoriesImage: {
    type: String,
  },
})

module.exports = Categories = mongoose.model('Categories', CategoriesSchema)
