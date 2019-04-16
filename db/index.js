const { Pool } = require('pg')

var connectionString = process.env.DATABASE_URL || 'postgres://teivyhilsxitmg:2c6b96200b45e98bb0a152c9d43629ca11e9c76f3d978eebdf7d840646d51c5c@ec2-54-75-230-253.eu-west-1.compute.amazonaws.com:5432/dcje70fjpt6ht6'

const pool = new Pool({
    connectionString,
    ssl: true
})


module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    }
}