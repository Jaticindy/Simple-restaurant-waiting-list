const db = require ('../config/conf')
const respons = require ('../respons')


    //controler getMeja
    const getMeja= (req,res)=>{
  
    const sql = `SELECT *FROM meja`
    console.log('Get is Running..')
  
    db.query (sql,(error,result)=>{
        if(error){
            console.log(error)
            respons(404,error,'Server Not Found',res)
            return
        }
        if(result.length == 0){
            respons(401,'Tersedia 10 Meja',"Meja Kosong",res)
            return
        }
        respons(200,result,'Get in meja',res)
    })
  }

    //controller getKasir
    const getKasir = (req, res) => {
      const sql = `select * from kasir`;
      console.log('Get is Running..');
    
      db.query(sql, (error, result) => {
        if (error) {
          console.log(error);
          respons(404, error, 'Server Not Found', res);
          return;
        }
        if (result.length == 0) {
          respons(401, 'No Data Found', 'Unauthorized', res);
          return;
        }
        respons(200, result, 'Get in Kasir', res);
      });
    };
    
    const getMenu = (req, res) => {
      const sql = `SELECT * FROM menu`;
      console.log('Get is Running..');
    
      db.query(sql, (error, result) => {
        if (error) {
          console.log(error);
          respons(404, error, 'Server Not Found', res);
          return;
        }
        if (result.length == 0) {
          respons(401, 'No Data Found', 'Unauthorized', res);
          return;
        }
        respons(200, result, 'Get in Menu', res);
      });
    };
    

    //gET Total Harga

    const getTotalHarga=(req, res) => {
      const nomor_meja = req.params.nomor_meja;
    
      // Query untuk memastikan bahwa meja tersedia dalam database
      const checkMejaQuery = `
        SELECT *
        FROM meja
        WHERE nomor_meja = ?
      `;
    
      db.query(checkMejaQuery, [nomor_meja], (error, results) => {
        if (error) {
          // Jika terjadi error saat query, kirim response error dengan status code 500
          console.error('Error executing query:', error);
          return  respons(500,'Server Error',"Internal Server Error",res)
        }
        console.log(results) 
        if (results.length === 0){
          // Jika meja dengan id yang diminta tidak ditemukan, kirim response error dengan status code 404
          return respons(404,'Not Found',"Meja Tidak Ditemukan",res)
        }
    
        // Query untuk mengambil total harga pesanan berdasarkan nomor_meja
        const getTotalHargaQuery = `
          SELECT SUM(total_harga) AS total_harga
          FROM pesanan
          WHERE nomor_meja = ?
        `;
    
        db.query(getTotalHargaQuery, [nomor_meja], (error, results) => {
          if (error) {
            // Jika terjadi error saat query, kirim response error dengan status code 500
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
    
          // Mengambil total harga dari hasil query
          const total_harga = results[0].total_harga;
    
          // Query untuk mengambil jam masuk dan nama pesanan berdasarkan nomor_meja
           // Query untuk mengambil jam masuk dan nama pesanan beserta harga satuan berdasarkan nomor_meja
      const QueryNamaPesanan = `
      SELECT menu.nama_menu, menu.harga, SUM(pesanan.jumlah_pesanan) AS jumlah_pesanan, (menu.harga * SUM(pesanan.jumlah_pesanan)) AS total_harga
FROM pesanan
JOIN menu ON pesanan.kode_menu = menu.kode_menu
WHERE pesanan.nomor_meja = ?
GROUP BY menu.nama_menu, menu.harga;

      
      `;
    
          db.query(QueryNamaPesanan, [nomor_meja], (error, results) => {
            if (error) {
              // Jika terjadi error saat query, kirim response error dengan status code 500
              console.error('Error executing query:', error);
              return  respons(500,'Server Error',"Internal Server Error",res)
            }
    
            const nama_pesanan = results.map(result => ({
                nama_menu: result.nama_menu,
                harga_satuan: result.harga,
                jumlah_pesanan: result.jumlah_pesanan,
              }));
            const all = ({nama_pesanan,total_harga});
            console.log(nama_pesanan)

            // const nama_pesanan = results.map(result => ({
            //   nama_menu: result.nama_menu,
            //   harga_satuan: result.harga,
            //   jumlah_pesanan: result.jumlah_pesanan,
            // }));
    
            // Mengembalikan total harga, jam masuk, dan nama pesanan dalam response dengan status code 200
            respons(200,all,"Success",res)
            return;
          });
        });
      });
    };
    
  
    //post Pembayaran
    const postPembayaran= (req, res) => {
        const nomor_meja = req.params.nomor_meja
        const jumlah_bayar = req.body.jumlah_bayar
      
        // Query untuk mengambil total harga pesanan berdasarkan nomor_meja
        const getTotalHargaQuery = `
          SELECT SUM(total_harga) AS total_harga
          FROM pesanan
          WHERE nomor_meja = ?
        `;
      
        db.query(getTotalHargaQuery, [nomor_meja], (error, results) => {
          if (error) {
            console.error('Error executing query:', error)
            respons(500,error,'Internal Server Error',res)
            return 
          }
      
          // Mengambil total harga dari hasil query
          const total_harga = results[0].total_harga
      
          // Mengecek apakah jumlah bayar cukup untuk membayar total harga pesanan
          if (jumlah_bayar < total_harga) {
             respons(400,error,'Jumlah bayar tidak mencukupi total harga pesanan',res)
             return
          }
      
          // Query untuk mengubah status pesanan menjadi 'SELESAI' dan menyimpan waktu pembayaran
          const updatePesananQuery = `
          UPDATE pesanan
          JOIN record ON pesanan.nomor_meja = record.nomor_meja
          SET pesanan.status = 'SELESAI', pesanan.waktu_pembayaran = NOW(),
              record.status = 'SELESAI', record.waktu_pembayaran = NOW()
          WHERE pesanan.nomor_meja = ?;
          
          `;
      
          db.query(updatePesananQuery, [nomor_meja], (error, results) => {
            if (error) {
              console.error('Error executing query:', error)
              respons(500,error,'Internal Server Error',res)
              return 
            }
      
            // Mengembalikan kembalian dan total harga dalam response
            const kembalian = jumlah_bayar - total_harga
            respons(200,{total_harga,kembalian},'success',res)
             return
          })
        })
      }

      //Post Registrasi Kasir
      const postRegistrasi = (req, res) => {
        const { nama_kasir, alamat_kasir, telpon_kasir, password } = req.body;
    
        const sql = `INSERT INTO kasir (nama_kasir, alamat_kasir, telpon_kasir, password) 
                    VALUES (?, ?, ?, ?)`;
        const values = [nama_kasir, alamat_kasir, telpon_kasir, password];
    
        if (Object.entries(req.body).length !== 4 ||
            !("nama_kasir" in req.body) ||
            !("alamat_kasir" in req.body) ||
            !("telpon_kasir" in req.body) ||
            !("password" in req.body)
        ) {
            respons(400, "Bad Request", "Unauthorized", res);
            return;
        }
    
        db.query(sql, values, (error, result) => {
            // error
            if (error) {
                console.error("Error executing query:", error);
                return respons(401, error, "Unauthorized", res);
            }
    
            // Success
            if (result.affectedRows) {
                const data = {
                    isSuccess: result.affectedRows,
                    id: result.insertId
                };
                console.log(result);
                respons(201, data, "Data Successfully Added", res);
            }
        });
    };
    
      
  // Put Registrasi
  const putRegistrasi = (req, res) => {
    const user = basicAuth(req)
    const id = req.params.id
    const { nama_kasir, alamat_kasir, telpon_kasir } = req.body
  
    // Periksa apakah semua field pada body request tersedia
    if (!nama_kasir || !alamat_kasir || !telpon_kasir) {
      return res.status(400).json({ error: "Bad Request" });
    }
  
    const sql = `UPDATE kasir SET nama_kasir = ?, alamat_kasir = ?, telpon_kasir = ? WHERE id_kasir = ?`
    const values = [nama_kasir, alamat_kasir, telpon_kasir, id]
    
  
    db.query(sql, values, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (result.affectedRows) {
        const data = {
          isSuccess: result.affectedRows,
        };
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ error: "Not Found" });
      }
    })
  }

  const delID= (req,res)=>{
    const {id} = req.body
   const sql= `DELETE FROM kasir WHERE id_kasir = ${id}`
  
  
   db.query(sql, (error, result) => {
      if (error) {
          return respons(500, "Invalid", "Server Error", res);
      } 
  
    if (result.affectedRows) { 
      const data = {
        isSuccess: result.affectedRows,
      }
      respons(200, data, "Successfully Deleted", res);
    } else {
      respons(404, {}, "Data not found", res);
      console.log(result)
    }
  })   
  }


  module.exports = {
    //get
    getMeja,
    getKasir,
    getMenu,
    getTotalHarga,
    //post
    postPembayaran,
    postRegistrasi,
    //put
    putRegistrasi,
    //delete
    delID

  }