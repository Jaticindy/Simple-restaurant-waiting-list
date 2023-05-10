// const mysql = require ('mysql')

// const db= mysql.createConnection({
    
//     host: "containers-us-west-66.railway.app",
//     user: "root",
//     password: "5ExjkHXc60NHg72tngP6",
//     database: "railway"
// })
// // process.env.DB_DATABASE

// db.connect((err) => {
//     if(err) {
//         console.log('Koneksi gagal:', err);
//     } else {
//         console.log('Koneksi berhasil!');
//     }
// });

// module.exports=db


var mysql = require('mysql');

var db = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log('Koneksi gagal:', err);
  } else {
    console.log('Koneksi berhasil!');
  }
});

module.exports = db;


