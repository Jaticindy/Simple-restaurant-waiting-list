const express = require ('express')
const router = express.Router()
const basicAuth = require ('basic-auth')

const auth = require ('../middleware/loges')
const KasirController= require ('../controller/kasir')
const { route } = require('./pesanan')



// Get all meja
router.get('/meja',auth,KasirController.getMeja)

// Get all kasir
router.get ('/',auth,KasirController.getKasir)
  
//get menu all
router.get ('/menu',auth,KasirController.getMenu)

 //get TotalHarga
 router.get ('/:nomor_meja/total_harga',auth,KasirController.getTotalHarga)

//Post Pembayaran
router.post ('/:nomor_meja/pembayaran',auth,KasirController.postPembayaran)

//Post Registrasi
router.post('/registrasi',auth,KasirController.postRegistrasi)

//Put Registrasi
router.put ('/edit/:id',auth,KasirController.putRegistrasi)
  
//Delete  
router.delete('/delete/:id',auth,KasirController.delID)  
 
  


module.exports = router
