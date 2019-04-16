const { Pool } = require('pg')

const pool = new Pool({
    connectionString: 'postgres://teivyhilsxitmg:2c6b96200b45e98bb0a152c9d43629ca11e9c76f3d978eebdf7d840646d51c5c@ec2-54-75-230-253.eu-west-1.compute.amazonaws.com:5432/dcje70fjpt6ht6'
})

//postgres://postgres:asop3396@127.0.0.1:3001/cube

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

pool.query('SELECT * FROM my_categoria WHERE categoria_id = $1', [1])
    .then(res => console.log('user:', res.rows[0]))
    .catch(e => setImmediate(() => { throw e }))

// pool.connect()
//     .then(client => {
//         return client.query('SELECT * FROM my_categoria WHERE categoria_id = $1', [1])
//             .then(res => {
//                 client.release()
//                 console.log(res.rows[0])
//             })
//             .catch(e => {
//                 client.release()
//                 console.log(err.stack)
//             })
//     })