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
        return respons(400, { error: 'Bad Request' }, 'Bad Request', res);
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
 
        let insertQuery = `INSERT INTO pesanan (nomor_meja, kode_menu, jumlah_pesanan, harga_satuan, total_harga, id_kasir)
         VALUES `;
        let insertValues = [];

        // Loop through each pesanan in the request body
        pesanan.forEach(pesananItem => {
            const { kode_menu, jumlah_pesanan } = pesananItem;

            // Query untuk memeriksa apakah kode_menu valid
            const checkMenuQuery = `SELECT * FROM menu WHERE kode_menu = ?`;

            db.query(checkMenuQuery, [kode_menu], (error, menuResults) => {
                if (error) {
                    console.error('Error executing query:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                if (menuResults.length === 0) {
                    return res.status(404).json({ error: `Menu with id ${kode_menu} not found` });
                }

                const harga = menuResults[0].harga;
                const total_harga = harga * jumlah_pesanan;

                insertQuery += `(?, ?, ?, ?, ?, ?),`
                insertValues.push(nomor_meja, kode_menu, jumlah_pesanan, harga, total_harga, id_kasir);

                // Check if this is the last pesanan in the array
                if (pesanan.indexOf(pesananItem) === pesanan.length - 1) {
                    // Remove the trailing comma from the insert query
                    insertQuery = insertQuery.slice(0, -1);

                    db.query(insertQuery, insertValues, (error, result) => {
                        if (error) {
                            console.error('Error executing query:', error)
                            return respons(500,error,"Internal Server Error",res)
                             
                        }

                        if (result.affectedRows) {
                            const data = {
                                isSuccess: true,
                                id_pesanan: result.insertId,
                            };
                             respons(201, data, 'Created', res)
                        } else {
                          respons(500,error,"Failed to create pesanan",res)
                            
                        }
                        const id_pesanan = 123; // replace with your actual value
                        let statusQuery = `
                        INSERT INTO record (id_kasir, nama_kasir, nomor_meja, total_harga, jumlah_pesanan, harga_satuan)
                        SELECT kasir.id_kasir, kasir.nama_kasir, pesanan.nomor_meja, pesanan.total_harga, pesanan.jumlah_pesanan, pesanan.harga_satuan
                        FROM pesanan
                        INNER JOIN kasir ON pesanan.id_kasir = kasir.id_kasir
                        WHERE pesanan.nomor_meja = ?;
                      `;
                      let insertQuery = ''; // initialize insertQuery to an empty string
                      let insertPush=[];
                      
                      insertQuery += `(?, ?, ?, ?, ?,?),`;
                      insertPush.push(id_kasir, nomor_meja, total_harga, jumlah_pesanan, harga);
                      
                      db.query(statusQuery, [nomor_meja], (error, result) => {
                        if (error) {
                          console.error(error);
                          respons(500,"",'Internal Server Error',res)
                        } else {
                          db.query('INSERT INTO detail_pesanan (id_pesanan, id_menu, jumlah) VALUES '
                           + insertQuery.slice(0, -1), insertPush, (error, result) => {
                            
                          });
                        }
                      });
                      

                        
                    });
                }
            });
        });
    });
};


  
const deletePesanan = (req, res) => {
    const id = req.params.nomor_meja;
  
    // Query SQL untuk menghapus data pesanan dan meja yang terkait
    const sql = `
          DELETE pesanan
      FROM pesanan
      WHERE pesanan.status = 'SELESAI' 
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
          console.log(error)
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