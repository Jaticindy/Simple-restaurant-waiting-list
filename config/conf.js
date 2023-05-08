const mysql = require ('mysql')

const db= mysql.createConnection({
    host:process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password:process.env.DB_PASS,
    database: process.env.DB_DATABASE
})

db.connect((err) => {
    if(err) {
        console.log('Koneksi gagal:', err);
    } else {
        console.log('Koneksi berhasil!');
    }
});

module.exports=db