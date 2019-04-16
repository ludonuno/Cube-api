const express = require('express')
const bodyParser = require('body-parser')

const api = require('./API/api.js')
const db = require('./db')

const app = express()
const port = process.env.PORT || 3000 

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.get('/', (req, res, next) => {
    db.connect()
    db.query('SELECT * FROM my_categoria', (err, res) => {
        if (err) {
            return next(err)
        }
        console.table(res.rows)
    })
})

app.get('/test', (req, res) => {
    res.send('test')
    console.log('test')
})














app.listen(port, () => {
    console.log(`App listen on port ${port}.`)
})