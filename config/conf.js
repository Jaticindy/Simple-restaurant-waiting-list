const mysql = require ('mysql')

const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"final_projects"
})

db.connect((err) => {
    if(err) {
        console.log('Koneksi gagal:', err);
    } else {
        console.log('Koneksi berhasil!');
    }
});

module.exports=db