// O que os métodos fazem
// GET      -> Busca o(s) regito(s) da(s) tabela(s)
// POST     -> Insere o(s) regito(s) da(s) tabela(s)
// PUT      -> Atualiza o(s) regito(s) da(s) tabela(s)
// DELETE   -> Apaga o(s) regito(s) da(s) tabela(s)

const express = require('express')
const bodyParser = require('body-parser')

const api = require('./API/api.js')

const app = express()
const port = process.env.PORT || 3000 // alterar para adaptar com o heroku

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

//API

app.get('/api/:table', (req, res) => {
    res.json({
        userId: api.users.GetUser(req.query.id)
    })
    
})

app.post('/api/:table', (req, res) => {

})

app.put('/api/:table', (req, res) => {

})

app.delete('/api/:table', (req, res) => {

})

//Gerir rotas não existentes

app.get('*', (req, res) => {
    res.json({
        error: api.ApiErrorMessage()
    })
})
app.post('*', (req, res) => {
    res.json({
        error: api.ApiErrorMessage()
    })
})
app.put('*', (req, res) => {
    res.json({
        error: api.ApiErrorMessage()
    })
})
app.delete('*', (req, res) => {
    res.json({
        error: api.ApiErrorMessage()
    })
})



app.listen(port, () => {
    console.log(`App listen on port ${port}.`)
})