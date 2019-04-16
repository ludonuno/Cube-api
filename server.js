const express = require('express')
const bodyParser = require('body-parser')

const api = require('./API/api.js')
const db = require('./db')

const { Client } = require('pg')

var connectionString = process.env.DATABASE_URL || ''

const client = new Client({
    connectionString,
    ssl: true
})

const app = express()
const port = process.env.PORT || 3000 // alterar para adaptar com o heroku

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

app.get('/', (req, res, next) => {
    console.log('teste')
    
    client.connect();
    
    client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
      if (err) throw err;
      for (let row of res.rows) {
        console.log(JSON.stringify(row));
      }
      client.end();
    });

    // db.query('SELECT * FROM my_categoria WHERE categoria_id = $1', [1], (err, res) => {
    //     if (err) {
    //         return next(err)
    //     }
    //     res.send(res.rows[0])
    // })
})

app.get('/test', (req, res) => {
    res.send('test')
    console.log('test')
})














app.listen(port, () => {
    console.log(`App listen on port ${port}.`)
})