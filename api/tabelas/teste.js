//Handle the Categoria(s) data from the table my_categoria

const db = require('./../../db')

var testeDB = (callback) => {
    db.query(`SELECT * FROM my_categoria`, (error, result) => {
        if (error) callback(error, undefined)
        else callback(undefined, result)
    })
}

module.exports = {
    testeDB
}
