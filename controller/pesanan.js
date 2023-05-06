const db = require ('../config/conf')
const respons = require ('../respons')


const getPesanan= (req, res) => {
    db.query('SELECT * FROM pesanan', (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(result);
      }
    })
  }

  
  const postPesanan = (req, res) => {
    const { nomor_meja, pesanan, id_kasir } = req.body;
  
    // Periksa apakah semua field pada body request tersedia
    if (!nomor_meja || !pesanan || !id_kasir) {
      respons(400,error,'Bad Request',res)
      return 
    }
  
    // Query untuk memeriksa apakah nomor_meja valid
    const checkMejaQuery = `SELECT * FROM meja WHERE nomor_meja = ?`;
  
    db.query(checkMejaQuery, [nomor_meja], (error, mejaResults) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (mejaResults.length === 0) {
        return res.status(404).json({ error: 'Meja not found' });
      }
  
      let insertQuery = `INSERT INTO pesanan (nomor_meja, id_menu, jumlah_pesanan, harga_satuan, total_harga, id_kasir) VALUES `
      let insertValues = [];
  
      // Loop through each pesanan in the request body
      pesanan.forEach(pesananItem => {
        const { id_menu, jumlah_pesanan } = pesananItem
  
        // Query untuk memeriksa apakah id_menu valid
        const checkMenuQuery = `SELECT * FROM menu WHERE id_menu = ?`
  
        db.query(checkMenuQuery, [id_menu], (error, menuResults) => {
          if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
  
          if (menuResults.length === 0) {
            return res.status(404).json({ error: `Menu with id ${id_menu} not found` });
          }
  
          const harga = menuResults[0].harga;
          const total_harga = harga * jumlah_pesanan;
  
          insertQuery += `(?, ?, ?, ?, ?, ?),`;
          insertValues.push(nomor_meja, id_menu, jumlah_pesanan, harga, total_harga, id_kasir);
  
          // Check if this is the last pesanan in the array
          if (pesanan.indexOf(pesananItem) === pesanan.length - 1) {
            // Remove the trailing comma from the insert query
            insertQuery = insertQuery.slice(0, -1);
  
            db.query(insertQuery, insertValues, (error, result) => {
              if (error) {
                console.error('Error executing query:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
              }
  
              if (result.affectedRows) {
                const data = {
                  isSuccess: true,
                  id_pesanan: result.insertId,
                }
                return respons(201,data,'Created',res)
              } else {
                return res.status(500).json({ error: 'Failed to create pesanan' })
              }
            })
          }
        })
      })
    })
  }

  
const deletePesanan = (req, res) => {
    const id = req.params.nomor_meja;
  
    // Query SQL untuk menghapus data pesanan dan meja yang terkait
    const sql = `
      DELETE pesanan, meja FROM pesanan
      JOIN meja ON pesanan.nomor_meja = meja.nomor_meja
      WHERE meja.nomor_meja = ? AND pesanan.status = 'SELESAI'
    `;
  
    db.query(sql, id, (error, result) => {
      if (error) {
        console.error(error);
        respons(500,"",'Internal Server Error',res)
      } else {
       
        if (result.affectedRows === 0) {
         
          const errPesanan = {
            affectedRows:result.affectedRows,
            insertId :result.insertId
          }
          respons(404,errPesanan,"Pesanan not found",res)
        } else {
          const resPesanan = {
            affectedRows:result.affectedRows,
            insertId :result.insertId
          }
          respons (200,resPesanan,'Pesanan and related meja deleted successfully',res)
        }
      }
    })
  }
  

  module.exports = {
    getPesanan,
    postPesanan,
    deletePesanan
  }