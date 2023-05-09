const mysql = require ('mysql')

const db= mysql.createConnection({
    host: bphfgejrbgcu6pikfztd-mysql.services.clever-cloud.com,
    user: usmtaxyvunyixctf,
    password: tYxkelo952eL2dPEX35Z,
    database: bphfgejrbgcu6pikfztd
})

db.connect((err) => {
    if(err) {
        console.log('Koneksi gagal:', err);
    } else {
        console.log('Koneksi berhasil!');
    }
});

module.exports=db
