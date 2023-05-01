const basicAuth = require('basic-auth')
const db = require ('../config/conf')
const respons = require ('../respons')


const auth = (req, res, next) => {
    // some authentication logic
    next()
  }
  
  module.exports = auth
  