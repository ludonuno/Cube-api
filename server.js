const express = require('express')
const bodyParser = require('body-parser')

const api = require('./API/api.js')

const app = express()
const port = process.env.PORT || 3000 

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.get('/', (req, res, next) => {
    //api.categoria.GetAllCategorias()
    var retorno = api.categoria.InsertCategoria('Horror')
    console.log(retorno) //undefined
})

app.get('/test', (req, res, next) => {
    res.send('test')
    console.log('test')
})














app.listen(port, () => {
    console.log(`App listen on port ${port}.`)
})