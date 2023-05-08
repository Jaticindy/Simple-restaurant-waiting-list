const express = require ('express')
const router = express.Router()
const basicAuth = require ('basic-auth')
const auth = require ('../middleware/loges')
const controlermeja= require ('../controller/meja')


// Post
router.post ('/upload',controlermeja.postMeja)

//put
router.put ('/edit/:nomor_meja',controlermeja.putMeja)

// Delete
router.delete('/:id',controlermeja.deleteMeja)

module.exports = router