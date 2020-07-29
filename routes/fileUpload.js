const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

const uploadImage = require('../services/image-upload')
const uploadVideo = require('../services/file-upload')

// const singleUpload = upload.single("image")

router.get('/test', (req, res) => {
  res.send('image test')
})

router.post('/upload', uploadImage.uploadImageToS3)
router.post('/file-upload', uploadVideo.uploadImageToS3)

// router.post("/upload", upload.single("image"), function (req, res, next) {
//   // console.log(req.body.name)
//   res.send("Successfully uploaded the file!")
// })

module.exports = router
