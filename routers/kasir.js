const express = require ('express')
const router = express.Router()
const basicAuth = require ('basic-auth')

const auth = require ('../middleware/loges')
const KasirController= require ('../controller/kasir')
const { route } = require('./pesanan')



// Get all meja
router.get('/meja',KasirController.getMeja)

// Get all kasir
router.get ('/',KasirController.getKasir)
  
//get menu all
router.get ('/menu',KasirController.getMenu)

 //get TotalHarga
 router.get ('/:nomor_meja/total_harga',KasirController.getTotalHarga)

//Post Pembayaran
router.post ('/:nomor_meja/pembayaran',KasirController.postPembayaran)

//Post Registrasi
router.post('/registrasi',KasirController.postRegistrasi)

//Put Registrasi
router.put ('/edit/:id',KasirController.putRegistrasi)
  
//Delete  
router.delete('/delete/:id',KasirController.delID)  
 
  


module.exports = router