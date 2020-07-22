const aws = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")

// aws.config.update({

// })

const s3 = new aws.S3({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: "ap-south-1"
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "lms-test-vaishnav",
    acl: "public-read",
    // metadata: function (req, file, cb) {
    //   cb(null, { fieldName: "TESTING_META_DATA" })
    // },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname)
    }
  })
})

module.exports = upload
