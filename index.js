require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')
const KasirRouter = require ('./routers/kasir')
const MejaRouter = require ('./routers/meja')
const CostRouter = require ('./routers/menu')
const PesananRouter = require ('./routers/pesanan')
const StatusRouter = require ('./routers/status')



app.use(bodyParser.json())
app.use ('/kasir',KasirRouter)
app.use ('/meja',MejaRouter)
app.use ('/menu',CostRouter)
app.use ('/pesanan',PesananRouter)
app.use ('/status',StatusRouter)
  

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))