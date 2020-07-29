const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const { v4: uuidv4 } = require('uuid')

// const accessKeyId = process.env.accessKeyId
// const secretAccessKey = process.env.secretAccessKey
// const region = "ap-south-1"

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: process.env.REGION,
})

const s3 = new aws.S3()

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'lms-test-vaishnav',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TESTING_META_DATA' })
    },
    key: function (req, file, cb) {
      cb(null, req.s3key)
    },
  }),
})

const singleFileUpload = upload.single('image')

function uploadToS3(req, res) {
  req.s3key = uuidv4()
  let downloadImageUrl = `https://lms-test-vaishnav.s3.${process.env.REGION}.amazonaws.com/${req.s3key}`
  return new Promise((resolve, reject) => {
    return singleFileUpload(req, res, (err) => {
      if (err) return reject(err)
      return resolve(downloadImageUrl)
    })
  })
}
// module.exports = upload

module.exports = {
  uploadImageToS3: (req, res) => {
    uploadToS3(req, res)
      .then((downloadImageUrl) => {
        console.log(downloadImageUrl)
        return res.status(200).send({ downloadImageUrl })
      })
      .catch((e) => {
        console.log(e)
      })
  },
}
