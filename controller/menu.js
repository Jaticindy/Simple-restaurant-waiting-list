const db = require ('../config/conf')
const respons = require ('../respons')




const postMenu = (req, res) => {
  const {kode_menu,nama_menu, deskripsi_menu, harga} = req.body;
  const {filename} = req.file || {};

  if (!filename) {
    respons(400,'Bad Request',"file not upload",res)
    return;
  }
  
  const sql = `INSERT INTO menu (kode_menu,nama_menu, deskripsi_menu, harga, gambar_menu) 
    VALUES ('${kode_menu}','${nama_menu}', '${deskripsi_menu}', '${harga}', '${filename}')`;

  if (Object.entries(req.body).length !== 4 ||
      !("nama_menu" in req.body) ||
      !("kode_menu" in req.body) ||
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
      })
     
    }else{
      const data = {
        isSuccess: result.affectedRows,
        id: result.insertId,
        gambar_menu: filename
      }
      console.log(result);
      respons(201,data,"Data Successfully Added",res)
    }
    
  });
}


const putMenu = (req, res) => {
    // const user = basicAuth(req)
    const id = req.params.id
    const { nama_menu, deskripsi_menu, harga } = req.body
  
    // Periksa apakah semua field pada body request tersedia
    if (!nama_menu || !deskripsi_menu || !harga) {
      return res.status(400).json({ error: "Bad Request" });
    }
  
    const sql = `UPDATE menu SET nama_menu = ?, deskripsi_menu = ?, harga = ? WHERE id = ?`
    const values = [nama_menu, deskripsi_menu, harga, id]
    
  
    db.query(sql, values, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (result.affectedRows) {
        const data = {
          UpdateisSuccess: result.affectedRows,
        }
        return  respons(200,data,"",res)
        res.status(200).json(data);
      } else {
        return res.status(404).json({ error: "Not Found" });
      }
    });
  }

  const deleteMenu= (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM menu WHERE id = ?', id, (err, result) => {
      
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        if (result.affectedRows === 0) {
          respons(404,"","Menu not found",res)
        } else {
          respons(200,"",'Menu deleted successfully',res)
        }
      }
    })
  }

module.exports = {
    postMenu,
    putMenu,
    deleteMenu
}