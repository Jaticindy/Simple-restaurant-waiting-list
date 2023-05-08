const express = require ('express')
const router = express.Router()
const basicAuth = require ('basic-auth')
const auth = require ('../middleware/loges')
const controllerStatus = require ('../controller/status')


router.get('/',controllerStatus.getStatus)

module.exports = router