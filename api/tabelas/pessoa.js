//Handle the Pessoa(s) data with the API

const db = require('./../../db')
const sizeOf = require('object-sizeof')

//TODO: Adicionar a verificação de formatação dos dados nos handlers scripts das tabelas !!!! Atenção aos textos para serem url friendly (ex: terem ? para nao dar erro dos parametros)

const tabela = {
    tabela: 'my_pessoa',
    id: 'pessoa_id',
    nome: 'pessoa_nome',
    foto: 'pessoa_foto',
    dataNascimento: 'pessoa_data_nascimento',
    biografia: 'pessoa_biografia'
}

var GetPessoa = (id, nome, dataNascimento, callback) => {
    return new Promise ((resolve, reject) => {
        let query
        if( nome && dataNascimento) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.nome} like '%${nome}%' AND ${tabela.dataNascimento} = '${dataNascimento}'`
        else if ( id || nome || dataNascimento) {
            if(id && isNaN(Number(id))) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`
            else if(nome) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.nome} like '%${nome}%'`
            else if(dataNascimento) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.dataNascimento} = '${dataNascimento}'`
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

var CreatePessoa = (nome, foto, dataNascimento, biografia, callback) => {
    return new Promise((resolve, reject) => {
        let query =`INSERT INTO ${tabela.tabela}`
        if(dataNascimento) {
            query += ` (${tabela.nome},${tabela.foto},${tabela.dataNascimento},${tabela.biografia}) VALUES ('${nome}', ${foto}, '${dataNascimento}', '${biografia}')`
        } else {
            query += ` (${tabela.nome},${tabela.foto},${tabela.biografia}) VALUES ('${nome}', ${foto}, '${biografia}')`            
        }
        db.query(query, (error, result) => {
            if (error) reject(db.message.error)
            else resolve('Registo inserido com sucesso')
        })
    }).then((resolve) => {
        callback(undefined, resolve)
    }, (err) => {
        callback(err, undefined)
    })
    
}

var UpdatePessoa = (id, nome, foto, dataNascimento, biografia, callback) => {
    return new Promise((resolve, reject) => {        
        GetPessoa(id, undefined, undefined, (error, result) => {
            if (error) reject(error)
            else {
                let query = `UPDATE ${tabela.tabela} SET `
                let numeroParametros = 0
                if (nome) {
                    query += `${tabela.nome} = '${nome}'`
                    numeroParametros++
                }
                if (foto) {
                    if (numeroParametros) query += ', '
                    query += `${tabela.foto} = '${foto}'`
                    numeroParametros++
                }
                if (dataNascimento) {
                    if (numeroParametros) query += ', '
                    query += `${tabela.dataNascimento} = '${dataNascimento}'`
                    numeroParametros++
                }
                if (biografia) {
                    if (numeroParametros) query += ', '
                    query += `${tabela.biografia} = '${biografia}'`
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

var DeletePessoa = (id, callback) => {
    return new Promise((resolve, reject) => {
        GetPessoa(id, undefined, undefined, (error, result) => {
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
    GetPessoa,
    CreatePessoa,
    UpdatePessoa,
    DeletePessoa
}
