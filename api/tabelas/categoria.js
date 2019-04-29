//Handle the Categoria(s) data from the table my_categoria

const db = require('./../../db')
const sizeOf = require('object-sizeof')

//TODO: Adicionar a verificação de formatação dos dados nos handlers scripts das tabelas !!!! Atenção aos textos para serem url friendly (ex: terem ? para nao dar erro dos parametros)

const tabela = {
    tabela: 'my_categoria',
    id: 'categoria_id',
    descricao: 'categoria_descricao'
}

var GetCategoria = (id, descricao, callback) => {
    return new Promise ((resolve, reject) => {
        let query
        
        if ( id || descricao ) {
            if(id && !isNaN(Number(id))) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`
            else if(descricao) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.descricao} like '%${descricao}%'`
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

var CreateCategoria = (descricao, callback) => {
    return new Promise((resolve, reject) => {
        GetCategoria(undefined, descricao, (error, result) => {
            if (error == db.message.dataNotFound) {
                db.query(`INSERT INTO ${tabela.tabela} (${tabela.descricao}) VALUES ('${descricao}')`, (error, result) => {
                    if (error) reject(db.message.internalError)
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

var UpdateCategoria = (id, descricao, callback) => {
    return new Promise((resolve, reject) => {
        GetCategoria(undefined, descricao, (error, result) => {
            if (result) reject(db.message.dataFound)
            else if (error == db.message.dataNotFound){
                GetCategoria(id, undefined, (error, result) => {
                    if (error) reject(error)
                    else {
                        db.query(`UPDATE ${tabela.tabela} SET ${tabela.descricao} = '${descricao}' WHERE ${tabela.id} = ${id}`, (error, result) => {
                            if (error) reject(db.message.internalError)
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

var DeleteCategoria = (id, callback) => {
    return new Promise((resolve, reject) => {
        GetCategoria(id, undefined, (error, result) => {
            if (error) reject(error)
            else {
                db.query(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`, (error, result) => {
                    if (error) reject(db.message.internalError)
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
    GetCategoria,
    CreateCategoria,
    UpdateCategoria,
    DeleteCategoria
}
