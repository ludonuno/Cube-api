//Handle the Editora(s) data from the table my_editora

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_editora',
    id: 'editora_id',
    nome: 'editora_nome'
}

var GetEditora = (id, nome, callback) => {
    return new Promise ((resolve, reject) => {
        let query

        if ( id || nome ) {
            if(id && !isNaN(Number(id))) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`
            else if(nome) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.nome} like '%${nome}%'`
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

var CreateEditora = (nome, callback) => {
    return new Promise((resolve, reject) => {
        GetEditora(undefined, nome, (error, result) => {
            if (error == db.message.dataNotFound) {
                db.query(`INSERT INTO ${tabela.tabela} (${tabela.nome}) VALUES ('${nome}')`, (error, result) => {
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

var UpdateEditora = (id, nome, callback) => {
    return new Promise((resolve, reject) => {
        GetEditora(undefined, nome, (error, result) => {
            if (result) reject(db.message.dataFound)
            else if (error == db.message.dataNotFound){
                GetEditora(id, undefined, (error, result) => {
                    if (error) reject(error)
                    else {
                        db.query(`UPDATE ${tabela.tabela} SET ${tabela.nome} = '${nome}' WHERE ${tabela.id} = ${id}`, (error, result) => {
                            if (error) reject(db.message.error)
                            else resolve('Registo alterado com sucesso')
                        })
                    }
                })
            } else reject(error)
        })
    }).then((resolve) => {
        callback(undefined, resolve)
    }, (err) => {
        callback(err, undefined)
    })
}

var DeleteEditora = (id, callback) => {
    return new Promise((resolve, reject) => {
        GetEditora(id, undefined, (error, result) => {
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
    GetEditora,
    CreateEditora,
    UpdateEditora,
    DeleteEditora
}
