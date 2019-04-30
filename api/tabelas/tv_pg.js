//Handle the TvPG(s) data from the table my_tv_pg

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_tv_pg',
    id: 'tv_pg_id',
    rate: 'tv_pg_rate',
    descricao: 'tv_pg_descricao'
}

var GetTvPG = (id, rate, callback) => {
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

var CreateTvPG = (rate, descricao, callback) => {
    GetTvPG(undefined, rate, (error, result) => {
        if (error == db.message.dataNotFound) {
            let query =`INSERT INTO ${tabela.tabela}`
            if(descricao) {
                query += ` (${tabela.rate},${tabela.descricao}) VALUES ('${rate}','${descricao}')`
            } else {
                query += ` (${tabela.rate}) VALUES ('${rate}')`            
            }
            db.query(query, (error, result) => {
                if (error) callback(db.message.error, undefined)
                else callback(undefined, 'Registo inserido com sucesso')
            })
        } else if (error) callback(error, undefined)
        else if (result) callback(db.message.dataFound, undefined)
    })
}

var UpdateTvPG = (id, rate, callback) => {
    return new Promise((resolve, reject) => {
        GetTvPG(id, undefined, (error, result) => {
            if (error) reject(error)
            else {
                let query = `UPDATE ${tabela.tabela} SET `
                let numeroParametros = 0
                if (rate) {
                    GetTvPG(undefined, rate, (error, result) => {
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

var DeleteTvPG = (id, callback) => {
    GetTvPG(id, undefined, (error, result) => {
        if (error) callback(error, undefined)
        else {
            db.query(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`, (error, result) => {
                if (error) callback(db.message.error, undefined)
                else callback(undefined, 'Registo apagado com sucesso')
            })
        }
    })
}

module.exports = {
    GetTvPG,
    CreateTvPG,
    UpdateTvPG,
    DeleteTvPG
}
