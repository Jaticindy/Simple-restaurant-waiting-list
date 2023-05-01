const express = require ('express')
const router = express.Router()
const basicAuth = require ('basic-auth')
const auth = require ('../middleware/loges')
const controlerMenu = require ('../controller/menu')
const uploads = require ('../controller/menu')



// post menu
router.post ('/',uploads.upload ,controlerMenu.postMenu)

//Put Menu
router.put('/edit/:id',controlerMenu.putMenu)

 // Delete menu
router.delete('/:id',controlerMenu.deleteMenu)
  
module.exports = router