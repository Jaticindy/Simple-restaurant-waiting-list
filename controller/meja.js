const db = require ('../config/conf')
const respons = require ('../respons')

const postMeja = ((req, res) => {
  const { nomor_meja, kapasitas } = req.body;
  
  db.query('SELECT COUNT(*) as total_meja FROM meja WHERE status_meja = ?', ['terisi'], (err, result) => {
    if (err) {
      console.error(err);
      respons(500,err,"Internal Server Error",res)
    } else {
      const total_meja_tersedia = result[0].total_meja;
      const max_kapasitas = 3;
      
      if (total_meja_tersedia >= max_kapasitas) {
        respons(400,'Bad Request','Meja Sudah Penuh',res)
      } else {
        db.query('INSERT INTO meja (nomor_meja, kapasitas, status_meja) VALUES (?, ?, ?)', [nomor_meja, kapasitas,'terisi'], (err, result) => {
          if (err) {
            console.log(err)
            const error = {
              code:err.code,
              message:err.sqlMessage
            }
            respons(500,error,"Meja Telah Terisi",res)
          } else {
            const hasil = {
              affectedRows : result.affectedRows,
              insertId : result.insertId,
              serverStatus : result.serverStatus,
              protocol41 : result.protocol41
            }
            respons(201,hasil,"Meja berhasil diinput",res)
          }
        });
      }
    }
  });
});


  const putMeja = (req, res) => {
    // const user = basicAuth(req)
    // const id = req.params.id
    const { nomor_meja } = req.params;
    const { status_meja } = req.body;
  
    if (status_meja !== 'kosong' && status_meja !== 'terisi') {
      respons(400, 'Bad Request', 'Status meja tidak valid', res);
      return;
    }
  
    db.query('UPDATE meja SET status_meja = ? WHERE nomor_meja = ?', [status_meja, nomor_meja], (err, result) => {
      if (err) {
        console.error(err);
        respons(500, err, "Internal Server Error", res);
      } else {
        const hasil = {
          affectedRows: result.affectedRows,
          changedRows: result.changedRows,
          serverStatus: result.serverStatus,
          protocol41: result.protocol41
        }
        respons(200, hasil, "Status meja berhasil diubah", res);
      }
    })
  }
  
  const deleteMeja = (req, res) => {
    const id = req.params.id;
    
    db.query('SELECT status_meja FROM meja WHERE nomor_meja = ?', id, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        if (result.length === 0) {
          respons(404, "", "Meja not found", res);
        } else {
          const statusMeja = result[0].status_meja;
          if (statusMeja === 'terisi') {
            respons(400, "", "Meja masih terisi", res);
          } else {
            db.query('DELETE FROM meja WHERE nomor_meja = ?', id, (err, result) => {
              if (err) {
                console.error(err)
                respons (500,"","Internal Server Error",res)
              } else {
                respons(200, "OK", 'Meja deleted successfully', res);
              }
            });
          }
        }
      }
    });
  };
  
  

module.exports= {
    postMeja,
    putMeja,
    deleteMeja
    
}