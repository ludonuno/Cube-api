//Handle the FilmePG(s) data from the table my_funcao

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_filme_pg',
    id: 'filme_pg_id',
    rate: 'filme_pg_rate',
    descricao: 'filme_pg_descricao'
}

var GetFilmePG = (id, rate, callback) => {
    return new Promise ((resolve, reject) => {
        let query

        if ( id || rate ) {
            if(id && !isNaN(Number(id))) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`
            else if(rate) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.rate} like '%${rate}%'`
        } else query = `SELECT * FROM ${tabela.tabela}`
        
        if(query) {
            db.query(query, (error, result) => {
                if (error) reject(db.message.internalError)
                else if (!sizeOf(result)) reject(db.message.dataNotFound)
                else resolve(result)
            })
        } else reject(db.message.dataError)

    }).then((resolve) => {
        callback(undefined, resolve)
    }, (err) => {
        callback(err, undefined)
    })
}

var CreateFilmePG = (rate, descricao, callback) => {
    return new Promise((resolve, reject) => {
        GetFilmePG(undefined, rate, (error, result) => {
            if (error == db.message.dataNotFound) {
                //insere descricao: 'null'
                db.query(`INSERT INTO ${tabela.tabela} (${tabela.rate},${tabela.descricao}) VALUES ('${rate}','${descricao}')`, (error, result) => {
                    if (error) reject(db.message.error)
                    else resolve('Registo inserido com sucesso')
                })
            } else if (error) reject(error)
            else if (result) reject(db.message.dataFound)
        })
    }).then((resolve) => {
        callback(undefined, resolve)
    }, (err) => {
        callback(err, undefined)
    })
}

var UpdateFilmePG = (id, rate, descricao, callback) => {
    return new Promise((resolve, reject) => {
        GetFilmePG(id, undefined, (error, result) => {
            if (error) reject(error)
            else {
                let query = `UPDATE ${tabela.tabela} SET `
                let numeroParametros = 0
                if (rate) {
                    GetFilmePG(undefined, rate, (error, result) => {
                        if(result) reject(db.message.dataFound)
                        else if (error == db.message.dataNotFound){
                            query += `${tabela.rate} = '${rate}'`
                            numeroParametros++
                        } else reject(error)
                    })
                }
                if (descricao) {
                    if (numeroParametros) query += ', '
                    query += `${tabela.descricao} = '${descricao}'`
                    numeroParametros++
                }
                query += ` WHERE ${tabela.id} = ${id}`
                db.query(query, (error, result) => {
                    if (error) reject(db.message.error)
                    else resolve('Registo alterado com sucesso')
                })
            }
        })        
    }).then((resolve) => {
        callback(undefined, resolve)
    }, (err) => {
        callback(err, undefined)
    })
}

var DeleteFilmePG = (id, callback) => {
    return new Promise((resolve, reject) => {
        GetFilmePG(id, undefined, (error, result) => {
            if (error) reject(error)
            else {
                db.query(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`, (error, result) => {
                    if (error) reject(db.message.error)
                    else resolve('Registo apagado com sucesso')
                })
            }
        })
    }).then((resolve) => {
        callback(undefined, resolve)
    }, (err) => {
        callback(err, undefined)
    })
}

module.exports = {
    GetFilmePG,
    CreateFilmePG,
    UpdateFilmePG,
    DeleteFilmePG
}