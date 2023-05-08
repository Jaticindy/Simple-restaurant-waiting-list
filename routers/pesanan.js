const express = require ('express')
const router = express.Router()
const basicAuth = require ('basic-auth')
const auth = require ('../middleware/loges')
const controlerPesanan = require ('../controller/pesanan')



    //get
    router.get('/',controlerPesanan.getPesanan)

    // Post Pesanan
    router.post('/',controlerPesanan.postPesanan)
    
    // Delete pesanan
    router.delete('/:nomor_meja',controlerPesanan.deletePesanan)


module.exports = router