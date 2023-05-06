const basicAuth = require('basic-auth')
const db = require ('../config/conf')
const respons = require ('../respons')


const auth = (req, res, next) => {
  const user= basicAuth(req)
  const sql1 = `select * from kasir WHERE nama_kasir =? and password = ?`
  db.query(sql1,[user.name, user.pass], (err,result)=>{
    if(err){
      respons(400, "Invalid Input", "Invalid input",res)
      return
    }
    if(!user.name || !user.pass){
      respons(400,"No Input username or password", "Authentication is required",res)
      return
    }
    const hasil = result[0]
    if (!hasil){
      respons(401, "No Data Found","Unauthorized",res)
      return
    }
    next()
  })

}
  
  module.exports = auth
  