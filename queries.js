const Pool = require('pg').Pool
const database = require('./database/database.js')

const pool = new Pool({
    user: '',
    host: '',
    database: '',
    password: '',
    port: ''
})