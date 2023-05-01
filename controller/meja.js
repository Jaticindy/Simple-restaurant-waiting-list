const db = require ('../config/conf')
const respons = require ('../respons')

const postMeja = ((req, res) => {
    const { nomor_meja, kapasitas } = req.body;
    
    db.query('SELECT COUNT(*) as total_meja FROM meja WHERE status_meja = ?', ['terisi'], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        const total_meja_tersedia = result[0].total_meja;
        const max_kapasitas = 3;
        
        if (total_meja_tersedia >= max_kapasitas) {
          respons(400,'Bad Request','Meja Sudah Penuh',res)
        } else {
          db.query('INSERT INTO meja (nomor_meja, kapasitas, status_meja) VALUES (?, ?, ?)', [nomor_meja, kapasitas,'terisi'], (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send('Internal Server Error');
            } else {
              res.status(201).send('Meja berhasil di input');
            }
          });
        }
      }
    });
  });

  const putMeja = (req, res) => {
    const user = basicAuth(req)
    const id = req.params.id
    const { nomor_meja, kapasitas } = req.body
  
    // Periksa apakah semua field pada body request tersedia
    if (!nomor_meja || !kapasitas) {
      return res.status(400).json({ error: "Bad Request" });
    }
  
    const sql = `UPDATE meja SET nomor_meja = ?, kapasitas = ?, status_meja = ? WHERE id_meja = ?`
    const values = [nomor_meja, kapasitas, 'tersedia', id]
    
  
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
    });
  }
  
  const deleteMeja= (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM meja WHERE id_meja = ?', id, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send('Meja not found');
        } else {
          res.send('Meja deleted successfully');
        }
      }
    })
  }
  

module.exports= {
    postMeja,
    putMeja,
    deleteMeja
    
}