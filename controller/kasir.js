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
            respons(401,'No Data Found',"Meja Kosong",res)
            return
        }
        respons(200,result,'Get in meja',res)
    })
  }

    //controller getKasir
    const getKasir = (req,res)=>{
        const sql = `SELECT *FROM kasir`
        console.log('Get is Running..')
    
        db.query (sql,(error,result)=>{
            if(error){
                console.log(error)
                respons(404,error,'Server Not Found',res)
                return
            }
            if(result.length == 0){
                respons(401,'No Data Found',"Unauthorized",res)
                return
            }
            respons(200,result,'Get in Kasir',res)
        })
    }

    // controller get menu all
    const getMenu= (req,res)=>{
    
        const sql = `SELECT *FROM menu`
        console.log('Get is Running..')
    
        db.query (sql,(error,result)=>{
            if(error){
                console.log(error)
                respons(404,error,'Server Not Found',res)
                return
            }
            if(result.length == 0){
                respons(401,'No Data Found',"Unauthorized",res)
                return
            }
            respons(200,result,'Get in Menu',res)
        })
    }

    const getTotalHarga=(req, res) => {
      const id_meja = req.params.id_meja;
    
      // Query untuk memastikan bahwa meja tersedia dalam database
      const checkMejaQuery = `
        SELECT *
        FROM meja
        WHERE id_meja = ?
      `;
    
      db.query(checkMejaQuery, [id_meja], (error, results) => {
        if (error) {
          // Jika terjadi error saat query, kirim response error dengan status code 500
          console.error('Error executing query:', error);
          return  respons(500,'Server Error',"Internal Server Error",res)
        }
    
        if (results.length === 0) {
          // Jika meja dengan id yang diminta tidak ditemukan, kirim response error dengan status code 404
          return respons(404,'Not Found',"Meja Tidak Ditemukan",res)
        }
    
        // Query untuk mengambil total harga pesanan berdasarkan id_meja
        const getTotalHargaQuery = `
          SELECT SUM(total_harga) AS total_harga
          FROM pesanan
          WHERE id_meja = ?
        `;
    
        db.query(getTotalHargaQuery, [id_meja], (error, results) => {
          if (error) {
            // Jika terjadi error saat query, kirim response error dengan status code 500
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
    
          // Mengambil total harga dari hasil query
          const total_harga = results[0].total_harga;
    
          // Query untuk mengambil jam masuk dan nama pesanan berdasarkan id_meja
          const QueryNamaPesanan = `
            SELECT menu.nama_menu, SUM(pesanan.jumlah_pesanan) AS jumlah_pesanan
            FROM pesanan
            JOIN menu ON pesanan.id_menu = menu.id_menu
            WHERE pesanan.id_meja = ?
            GROUP BY menu.nama_menu;
          `;
    
          db.query(QueryNamaPesanan, [id_meja], (error, results) => {
            if (error) {
              // Jika terjadi error saat query, kirim response error dengan status code 500
              console.error('Error executing query:', error);
              return  respons(500,'Server Error',"Internal Server Error",res)
            }
    
            const nama_pesanan = results.map(result => result.nama_menu);
            const all = ({nama_pesanan,total_harga});
            console.log(nama_pesanan)
    
            // Mengembalikan total harga, jam masuk, dan nama pesanan dalam response dengan status code 200
            respons(200,all,"Success",res)
            return;
          });
        });
      });
    };
    
  
    //post Pembayaran
    const postPembayaran= (req, res) => {
        const id_meja = req.params.id_meja
        const jumlah_bayar = req.body.jumlah_bayar
      
        // Query untuk mengambil total harga pesanan berdasarkan id_meja
        const getTotalHargaQuery = `
          SELECT SUM(total_harga) AS total_harga
          FROM pesanan
          WHERE id_meja = ?
        `;
      
        db.query(getTotalHargaQuery, [id_meja], (error, results) => {
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
            SET status = 'SELESAI', waktu_pembayaran = NOW()
            WHERE id_meja = ?
          `;
      
          db.query(updatePesananQuery, [id_meja], (error, results) => {
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
      const postRegistrasi= (req,res)=>{
        const {nama_kasir, alamat_kasir, telepon_kasir}=req.body
    
        const sql = `INSERT INTO kasir (nama_kasir, alamat_kasir, telepon_kasir) 
        VALUES ('${nama_kasir}', '${alamat_kasir}', '${telepon_kasir}')`;
    
    
        if (Object.entries (req.body).length !==3 ||
        !("nama_kasir" in req.body) ||
        !("alamat_kasir" in req.body) ||
        !("telepon_kasir" in req.body)
        ){
       respons(400 ,"Bad Request ","Unauthorized",res)
        return  
        }
        
    
        db.query(sql,(error,result)=>{
          //error
            if(error){
              console.error("Error executing query:",error)
             return respons(401 ,error,"Unauthorized",res)
            }
            
            //Success
            if(result.affectedRows){ 
                const data = {
                    isSuccess:result.affectedRows,
                    id:result.insertId
                    
                }
                console.log(result)
                respons(201,data,"Data Successfully Added",res)
            }
        })
    }
      
  // Put Registrasi
  const putRegistrasi = (req, res) => {
    const user = basicAuth(req)
    const id = req.params.id
    const { nama_kasir, alamat_kasir, telepon_kasir } = req.body
  
    // Periksa apakah semua field pada body request tersedia
    if (!nama_kasir || !alamat_kasir || !telepon_kasir) {
      return res.status(400).json({ error: "Bad Request" });
    }
  
    const sql = `UPDATE kasir SET nama_kasir = ?, alamat_kasir = ?, telepon_kasir = ? WHERE id_kasir = ?`
    const values = [nama_kasir, alamat_kasir, telepon_kasir, id]
    
  
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