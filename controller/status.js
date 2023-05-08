const db = require ('../config/conf')
const respons = require ('../respons');
const router = require('../routers/pesanan');



const getStatus= (req, res) => {
    db.query(`select * from record;
  `, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(result);
      }
    })
  }
  


// const getStatus = (req, res) => {
//     const { nomor_meja } = req.query;
  
//     // Periksa apakah nomor_meja tersedia pada query
//     if (!nomor_meja) {
//       return respons(400, { error: 'Bad Request' }, 'Bad Request', res);
//     }
  
//     // Query untuk mendapatkan status pesanan
//     const getStatusQuery = `
//       SELECT
//         p.id_pesanan,
//         p.nomor_meja,
//         p.total_harga,
//         p.jumlah_pesanan,
//         p.harga_satuan,
//         p.status,
//         p.waktu_pembayaran
//       FROM
//         pesanan p
//       WHERE
//         p.nomor_meja = ?
//       ORDER BY
//         p.id_pesanan DESC
//       LIMIT 1
//     `;
  
//     db.query(getStatusQuery, [nomor_meja], (error, result) => {
//       if (error) {
//         console.error('Error executing query:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }
  
//       if (result.length === 0) {
//         return res.status(404).json({ error: `No status found for meja with nomor_meja ${nomor_meja}` });
//       }
  
//       const data = {
//         isSuccess: true,
//         status: result[0],
//       };
  
//       return respons(200, data, 'OK', res);
//     });
//   };
  
  module.exports = {getStatus}