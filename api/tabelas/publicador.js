const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_publicador',
    id: 'publicador_id',
    nome: 'publicador_nome'
}
var GetPublicador = (id, nome, callback) => {
    return new Promise ((resolve, reject) => {
        let query

        if ( id || nome ) {
            if(id && isNaN(id)) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`
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

var CreatePublicador = (nome, callback) => {
    GetPublicador(undefined, nome, (error, result) => {
        if (error == db.message.dataNotFound) {
            db.query(`INSERT INTO ${tabela.tabela} (${tabela.nome}) VALUES ('${nome}')`, (error, result) => {
                if (error) callback(db.message.error, undefined)
                else callback(undefined, 'Registo inserido com sucesso')
            })
        } else if (error) callback(error, undefined)
        else if (result) callback(db.message.dataFound, undefined)
    })
}

var UpdatePublicador = (id, nome, callback) => {
    GetPublicador(undefined, nome, (error, result) => {
        if (result) callback(db.message.dataFound, undefined)
        else if (error == db.message.dataNotFound){
            GetPublicador(id, undefined, (error, result) => {
                if (error) callback(error, undefined)
                else {
                    db.query(`UPDATE ${tabela.tabela} SET ${tabela.nome} = '${nome}' WHERE ${tabela.id} = ${id}`, (error, result) => {
                        if (error) callback(db.message.error, undefined)
                        else callback(undefined, 'Registo alterado com sucesso')
                    })
                }
            })
        } else callback(error, undefined)
    })
}

var DeletePublicador = (id, callback) => {
    GetPublicador(id, undefined, (error, result) => {
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
    GetPublicador,
    CreatePublicador,
    UpdatePublicador,
    DeletePublicador
}
