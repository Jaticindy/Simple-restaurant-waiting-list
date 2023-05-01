const db = require ('../config/conf')
const respons = require ('../respons')
const express = require('express')
const app = express()
const multer  = require('multer');


// definisikan storage untuk penyimpanan file
const storage = multer.diskStorage({
  // lokasi penyimpanan file
  destination: function (req, file, cb) {
      cb(null, 'uploads')
  },
  // membuat nama file unik agar tidak bertabrakan dengan file lainnya saat diakses dan memberi ekstensi sesuai mimetype
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      if ( file.mimetype == 'image/jpeg') {
          var mimetype = '.jpg'
      } else if ( file.mimetype == 'image/png') {
          var mimetype = '.png'
      } else {
          var mimetype = '.file'
      }
      cb(null, uniqueSuffix + mimetype)
  }
})
// definisikan upload untuk single file
const upload = multer({ storage: storage }).single('image')

// gunakan folder public sebagai static
app.use(express.static('public'))


const postMenu =(req, res) => {
  const {nama_menu, deskripsi_menu, harga} = req.body;
  const {filename} = req.file || {};

  if (!filename) {
    respons(400,'Bad Request',"file not upload",res)
    return;
  }
  
  const sql = `INSERT INTO menu (nama_menu, deskripsi_menu, harga, gambar_menu) 
    VALUES ('${nama_menu}', '${deskripsi_menu}', '${harga}', '${filename}')`;

  if (Object.entries(req.body).length !== 3 ||
      !("nama_menu" in req.body) ||
      !("deskripsi_menu" in req.body) ||
      !("harga" in req.body)
  ) {
    res.status(400).json({
      success: false,
      message: "Bad Request"
    });
    return;
  }

  db.query(sql, (error, result) => {
    if (error) {
      console.error("Error executing query:",error);
      res.status(401).json({
        success: false,
        message: error.message
      });
      return;
    }

    if (result.affectedRows) { 
      const data = {
        isSuccess: result.affectedRows,
        id: result.insertId,
        gambar_menu: filename
      }
      console.log(result);
      res.status(201).json({
        success: true,
        message: "Data Successfully Added",
        data: data
      });
    }
  });
}




const putMenu = (req, res) => {
    const user = basicAuth(req)
    const id = req.params.id
    const { nama_menu, deskripsi_menu, harga } = req.body
  
    // Periksa apakah semua field pada body request tersedia
    if (!nama_menu || !deskripsi_menu || !harga) {
      return res.status(400).json({ error: "Bad Request" });
    }
  
    const sql = `UPDATE menu SET nama_menu = ?, deskripsi_menu = ?, harga = ? WHERE id_menu = ?`
    const values = [nama_menu, deskripsi_menu, harga, id]
    
  
    db.query(sql, values, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (result.affectedRows) {
        const data = {
          UpdateisSuccess: result.affectedRows,
        };
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ error: "Not Found" });
      }
    });
  }

  const deleteMenu= (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM menu WHERE id_menu = ?', id, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send('Menu not found');
        } else {
          res.send('Menu deleted successfully');
        }
      }
    })
  }

module.exports = {
    postMenu,
    putMenu,
    deleteMenu,
    upload
}