const express = require ('express')
const router = express.Router()
const controlerMenu = require ('../controller/menu')
const uploads = require ('../controller/menu')
const uploadImage = require ('../middleware/multer')


// post menu
router.post ('/',(uploads.upload,uploadImage),controlerMenu.postMenu)

//Put Menu
router.put('/edit/:id',controlerMenu.putMenu)

 // Delete menu
router.delete('/:id',controlerMenu.deleteMenu)
  
module.exports = router