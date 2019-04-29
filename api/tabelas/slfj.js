const db = require('./../../db')
const sizeOf = require('object-sizeof')

const categoria = require('./categoria.js')
const saga = require('./saga.js')

const tabela = {
    tabela: 'my_slfj',
    id: 'slfj_id',
    titulo: 'slfj_titulo',
    foto: 'slfj_foto',
    sinopse: 'slfj_sinopse',
    categoriaId: 'categoria_id',
    sagaId: 'saga_id'
}

var GetSLFJ = (id, titulo, categoriaId, sagaId) => {
    return new Promise ((resolve, reject) => {
        let query
    
        if(nome && (categoriaId || sagaId)) {
            if (categoriaId && sagaId) {
                categoria.GetCategoria(categoriaId, undefined, (error, result) => {
                    if(result) {
                        saga.GetSaga(sagaId, undefined, (error, result) => {
                            if(result) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.titulo} like '%${titulo}%' AND ${tabela.categoriaId} = ${categoriaId} AND ${tabela.sagaId} = ${sagaId}`
                        })
                    }
                })
            } else if (categoriaId){
                categoria.GetCategoria(categoriaId, undefined, (error, result) => {
                    if(result) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.titulo} like '%${titulo}%' AND ${tabela.categoriaId} = ${categoriaId}`
                })
            } else if (sagaId) {
                saga.GetSaga(sagaId, undefined, (error, result) => {
                    if(result) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.titulo} like '%${titulo}%' AND ${tabela.sagaId} = ${sagaId}`
                })
            }
        } else if ( id || titulo || categoriaId || sagaId) {
            if(id && isNaN(id)) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`
            else if(titulo) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.titulo} like '%${titulo}%'`
            else if(categoriaId) {
                categoria.GetCategoria(categoriaId, undefined, (error, result) => {
                    if(result) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.categoriaId} = ${categoriaId}`
                })
            } else if(sagaId) {
                saga.GetSaga(sagaId, undefined, (error, result) => {
                    if(result) query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.sagaId} = ${sagaId}`
                })
            }
        } else query = `SELECT * FROM ${tabela.tabela}`
        console.log(query)
        if(query) {
            db.query(query, (error, result) => {
                if (error) reject(db.message.internalError)
                else if (!sizeOf(result)) reject(db.message.dataNotFound)
                else resolve(result)
                //TODO: circular pelas tabelas my_serie, my_livro, my_filme e my_jogo dependendo da categoria
            })
        } else reject(db.message.dataError)

    }).then((resolve) => {
        callback(undefined, resolve)
    }, (err) => {
        callback(err, undefined)
    })
}

var CreateSLFJ = (titulo, foto, sinopse, categoriaId, sagaId) => {
    return new Promise((resolve, reject) => {
        categoria.GetCategoria(categoriaId, undefined, (error, result) => {
            if (error) reject(error)
            else {
                saga.GetSaga(sagaId, undefined, (error, result) => {
                    if (error) reject(error)
                    else {
                        db.query(`INSERT INTO ${tabela.tabela} (${tabela.titulo}, ${tabela.foto}, ${tabela.sinopse}, ${tabela.categoriaId}, ${tabela.sagaId}) VALUES ('${titulo}', ${foto}, '${sinopse}', ${categoriaId}, ${sagaId})`, (error, result) => {
                            if (error) reject(db.message.internalError)
                            else resolve('Registo inserido com sucesso')
                        })
                    }
                })
            }
        })
    }).then((resolve) => {
        callback(undefined, resolve)
    }, (err) => {
        callback(err, undefined)
    })
}
var UpdateSLFJ = (id, titulo, foto, sinopse, categoriaId, sagaId) => {
    return new Promise((resolve, reject) => {        
        GetSLFJ(id, undefined, undefined, undefined, (error, result) => {
            if (error) reject(error)
            else {
                let query = `UPDATE ${tabela.tabela} SET `
                let numeroParametros = 0
                let tabelasExternasInvalidas = 0

                if (titulo) {
                    query += `${tabela.nome} = '${nome}'`
                    numeroParametros++
                }
                if (foto) {
                    if (numeroParametros) query += ', '
                    query += `${tabela.foto} = ${foto}`
                    numeroParametros++
                }
                if (sinopse) {
                    if (numeroParametros) query += ', '
                    query += `${tabela.dataNascimento} = '${dataNascimento}'`
                    numeroParametros++
                }
                if (categoriaId) {
                    categoria.GetCategoria(categoriaId, undefined, (error, result) => {
                        if(result) {
                            if (numeroParametros) query += ', '
                            query += `${tabela.categoriaId} = ${categoriaId}`
                            numeroParametros++
                        } else if(error) tabelasExternasInvalidas++
                    })
                }
                if (sagaId) {
                    saga.GetSaga(sagaId, undefined, (error, result) => {
                        if(result) {
                            if (numeroParametros) query += ', '
                            query += `${tabela.sagaId} = ${sagaId}`
                            numeroParametros++
                        } else if(error) tabelasExternasInvalidas++
                    })
                }
                query += ` WHERE ${tabela.id} = ${id}`
                if(!tabelasExternasInvalidas) {
                    db.query(query, (error, result) => {
                        if (error) reject(db.message.error)
                        else resolve('Registo alterado com sucesso')
                    })
                } else reject(db.message.dataError)
            }
        })    
    }).then((resolve) => {
        callback(undefined, resolve)
    }, (err) => {
        callback(err, undefined)
    })
}

var DeleteSLFJ = (id) => {
    return new Promise((resolve, reject) => {
        GetSLFJ(id, undefined, undefined, undefined, (error, result) => {
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
    GetSLFJ,
    CreateSLFJ,
    UpdateSLFJ,
    DeleteSLFJ
}
