// O que os métodos fazem
// GET      -> Busca o(s) regito(s) da(s) tabela(s)
// POST     -> Insere o(s) regito(s) da(s) tabela(s)
// PUT      -> Atualiza o(s) regito(s) da(s) tabela(s)
// DELETE   -> Apaga o(s) regito(s) da(s) tabela(s)

const express = require('express')
const bodyParser = require('body-parser')

const api = require('./API/api.js')
const query = require('./queries.js')

const app = express()
const port = process.env.PORT || 3000 // alterar para adaptar com o heroku

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.get('/', (req, res) => {
    res.send('/')
    console.log('/')
})

app.get('/test', (req, res) => {
    res.send('test')
    console.log('test')
})














app.listen(port, () => {
    console.log(`App listen on port ${port}.`)
})