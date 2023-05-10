Restaurant Management System
Ini adalah sistem manajemen restoran sederhana yang dibangun menggunakan Node.js dan MySQL. Sistem ini memungkinkan pengguna untuk mengelola meja, menu, pesanan, dan status pesanan dalam sebuah restoran.

Daftar Isi
Instalasi
Konfigurasi Database
Menjalankan Aplikasi
Endpoint API
Penggunaan
Kontribusi
Lisensi

Instalasi
Clone repositori ini:
git clone https://github.com/nama-pengguna/repo.git

Masuk ke direktori proyek:
cd restaurant-management-system

Install dependencies dengan menggunakan npm:
npm install

Konfigurasi Database
Buat file konfigurasi database dengan nama config.js dalam direktori config. Contoh isi file konfigurasi:

var db = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
})

Pastikan untuk mengganti username, password, dan nama_database dengan informasi yang sesuai.

Import file database.sql ke dalam database MySQL untuk membuat skema dan tabel yang diperlukan.
Menjalankan Aplikasi
npm start
Aplikasi akan berjalan pada http://localhost:3000.

Endpoint API
Berikut ini adalah daftar endpoint API yang tersedia:

GET /pesanan - Mendapatkan daftar pesanan

POST /pesanan - Menambahkan pesanan baru

DELETE /pesanan/:nomor_meja - Menghapus pesanan berdasarkan nomor meja

GET /pesanan/status - Mendapatkan status pesanan

POST /meja - Menambahkan meja baru

PUT /meja/:nomor_meja - Mengubah status meja

DELETE /meja/:nomor_meja - Menghapus meja berdasarkan nomor meja

POST /menu - Menambahkan menu baru

PUT /menu/:id_menu - Mengubah menu

DELETE /menu/:id_menu - Menghapus menu berdasarkan ID menu

Penggunaan
Untuk menambahkan pesanan, gunakan endpoint POST /pesanan dengan body request yang sesuai.
Untuk mengubah status meja, gunakan endpoint PUT /meja/:nomor_meja dengan body request yang sesuai.
Untuk menghapus meja, gunakan endpoint DELETE /meja/:nomor_meja.
Untuk mengubah menu, gunakan endpoint PUT /menu/:id_menu dengan body request yang sesuai.
Untuk menghapus menu, gunakan endpoint DELETE /menu/:id_menu.
Kontribusi
Kontribusi terbuka untuk siapa saja yang ingin meningkatkan proyek ini. Silakan buat pull request dengan perubahan Anda.

Lisensi
Proyek
