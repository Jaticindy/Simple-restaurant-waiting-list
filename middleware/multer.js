const express = require('express')
const app = express()
const multer  = require('multer')

// definisikan storage untuk penyimpanan file
const storage = multer.diskStorage({
    // lokasi penyimpanan file
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    // membuat nama file unik agar tidak bertabrakan dengan file lainnya saat diakses dan memberi ekstensi sesuai mimetype
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        if ( file.mimetype == 'image/jpeg') {
            var mimetype = '.jpg'
        } else if ( file.mimetype == 'image/png') {
            var mimetype = '.png'
        } else {
            var mimetype = '.file'
        }
        cb(null, uniqueSuffix + mimetype)
    }
  })
  // definisikan upload untuk single file
  const upload = multer({ storage: storage }).single('image')
  
  // gunakan folder public sebagai static
  app.use(express.static('public'))

module.exports = upload