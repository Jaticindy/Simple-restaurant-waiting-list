
var mysql = require('mysql2')

var db = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
})
console.log(db)

db.connect((err) => {
  if (err) {
    console.log('Koneksi gagal:', err);
  } else {
    console.log('Koneksi berhasil!');
  }
});


module.exports = db;



module.exports=db
