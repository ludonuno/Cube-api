//Handle the Categoria(s) data from the table my_categoria

const db = require('./../../db')
const sizeOf = require('object-sizeof')

var testeDB = (callback) => {
    db.query(`SELECT * FROM my_categoria`, (error, result) => {
        if (error) callback(error, undefined)
        else callback(undefined, result.rows)
    })
}

module.exports = {
    testeDB
}