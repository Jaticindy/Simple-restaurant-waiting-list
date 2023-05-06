const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const KasirRouter = require ('./routers/kasir')
const MejaRouter = require ('./routers/meja')
const CostRouter = require ('./routers/menu')
const PesananRouter = require ('./routers/pesanan')


app.use(bodyParser.json())
app.use ('/kasir',KasirRouter)
app.use ('/meja',MejaRouter)
app.use ('/menu',CostRouter)
app.use ('/pesanan',PesananRouter)
  



app.listen(port, () => console.log(`Example app listening on port ${port}!`))