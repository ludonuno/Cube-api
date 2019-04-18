//Handle the Categoria(s) data with the API

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const errorMessageDB = 'Ocorreu um problema na base de dados'
const noDataMessageDB = 'Não foram encontrados registos com o id pretendido'
const dataExistsMessageDB = 'Categoria existente'

var GetAllCategorias = (callback) => {
    db.query('SELECT * FROM my_categoria', (error, result) => {
        if (error) callback(errorMessageDB, undefined)
        else if (!sizeOf(result.rows)) callback('Sem registos', undefined)
        else callback(undefined, result.rows)
    })
}

var GetCategoriaById = (id, callback) => {
    if (!isNaN(id)) {
        db.query(`SELECT * FROM my_categoria WHERE categoria_id = ${id}`, (error, result) => {
            if (error) callback(errorMessageDB, undefined)
            else if (!sizeOf(result.rows[0])) callback(noDataMessageDB, undefined) //sizeOf is 0?
            else callback(undefined, result.rows[0]) 
        })
    } else callback('O tipo de dado fornecido não é válido', undefined)
}

var GetCategoriaByDescricao = (descricao, callback) => {
    //TODO: verificar a SQL injection
    db.query(`SELECT * FROM my_categoria WHERE categoria_descricao = '${descricao.toLowerCase()}'`, (error, result) => {
        if (error) callback(errorMessageDB, undefined)
        else if (!sizeOf(result.rows[0])) callback(noDataMessageDB, undefined) //sizeOf is 0?
        else callback(undefined, result.rows[0]) 
    })
}

var CreateCategoria = (descricao, callback) => {
    GetCategoriaByDescricao(descricao, (error, result) => {
        if (error == noDataMessageDB) {
            db.query(`INSERT INTO my_categoria (categoria_descricao) VALUES ('${descricao.toLowerCase()}')`, (error, result) => {
                if (error) callback(errorMessageDB, undefined)
                else callback(undefined, 'Categoria inserida com sucesso')
            })
        } else if (error) callback(error, undefined)
        else if (result) callback(dataExistsMessageDB, undefined)
    })
}

var UpdateCategoria = (id, descricao, callback) => {
    GetCategoriaByDescricao(descricao, (error, result) => {
        if (result) callback(dataExistsMessageDB, undefined)
        else if (error == noDataMessageDB){
            GetCategoriaById(id, (error, result) => {
                if (error) callback(error, undefined)
                else {
                    db.query(`UPDATE my_categoria SET categoria_descricao = '${descricao.toLowerCase()}' WHERE categoria_id = ${id}`, (error, result) => {
                        if (error) callback(errorMessageDB, undefined)
                        else callback(undefined, 'Categoria alterada com sucesso')
                    })
                }
            })
        } else callback(error, undefined)
    })
}

var DeleteCategoria = (id, callback) => {
    GetCategoriaById(id, (error, result) => {
        if (error) callback(error, undefined)
        else {
            db.query(`DELETE FROM my_categoria WHERE categoria_id = ${id}`, (error, result) => {
                if (error) callback(errorMessageDB, undefined)
                else callback(undefined, 'Categoria apagada com sucesso')
            })
        }
    })
}

module.exports = {
    GetAllCategorias,
    GetCategoriaById,
    GetCategoriaByDescricao,
    CreateCategoria,
    UpdateCategoria,
    DeleteCategoria
}
