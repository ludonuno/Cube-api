const {Pool} = require('pg')

var pool

if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    })
} else {
    pool = new Pool({
        user: 'postgres',
        password: 'asop3396',
        port: 5432,
        host: 'localhost',
        database: 'cube'
    })
}

module.exports = {
    connect: () => {
        pool.connect()
        .then(() => console.log("Connected sucessfuly"))
        .catch(e => console.error(e))
        .finally(() => pool.end())
    },
    query: (text, callback) => pool.query(text, callback),
}