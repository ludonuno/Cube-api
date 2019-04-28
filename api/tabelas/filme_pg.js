//Handle the FilmePG(s) data from the table my_funcao

const db = require('./../../db')
const sizeOf = require('object-sizeof')

//TODO: Adicionar a verificação de formatação dos dados nos handlers scripts das tabelas !!!! Atenção aos textos para serem url friendly (ex: terem ? para nao dar erro dos parametros)
//TODO: verificar que permite a introdução de caracteres especiais no rate (ex: +18)

const tabela = {
    tabela: 'my_filme_pg',
    id: 'filme_pg_id',
    rate: 'filme_pg_rate',
    descricao: 'filme_pg_descricao'
}
var GetAllFilmePGs = (callback) => {
    db.query(`SELECT * FROM ${tabela.tabela}`, (error, result) => {
        if (error) callback(db.message.error, undefined)
        else if (!sizeOf(result.rows)) callback(db.message.dataNotFound, undefined)
        else callback(undefined, result.rows)
    })
}

var GetFilmePGById = (id, callback) => {
    if (!isNaN(id)) {
        db.query(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`, (error, result) => {
            if (error) callback(db.message.error, undefined)
            else if (!sizeOf(result.rows[0])) callback(db.message.dataNotFound, undefined) //sizeOf is 0?
            else callback(undefined, result.rows[0]) 
        })
    } else callback('O tipo de dado fornecido não é válido', undefined)
}

var GetFilmePGByRate = (rate, callback) => {
    db.query(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.rate} LIKE '${rate.toLowerCase()}'`, (error, result) => {
        if (error) callback(db.message.error, undefined)
        else if (!sizeOf(result.rows[0])) callback(db.message.dataNotFound, undefined) //sizeOf is 0?
        else callback(undefined, result.rows[0]) 
    })
}

var CreateFilmePG = (rate, descricao, callback) => {
    GetFilmePGByRate(rate, (error, result) => {
        if (error == db.message.dataNotFound) {
            db.query(`INSERT INTO ${tabela.tabela} (${tabela.rate},${tabela.descricao}) VALUES ('${rate.toLowerCase()}','${descricao.toLowerCase()}')`, (error, result) => {
                if (error) callback(db.message.error, undefined)
                else callback(undefined, 'Registo inserido com sucesso')
            })
        } else if (error) callback(error, undefined)
        else if (result) callback(db.message.dataFound, undefined)
    })
}

var CreateFilmePGRate = (rate, callback) => {
    GetFilmePGByRate(rate, (error, result) => {
        if (error == db.message.dataNotFound) {
            db.query(`INSERT INTO ${tabela.tabela} (${tabela.rate}) VALUES ('${rate.toLowerCase()}')`, (error, result) => {
                if (error) callback(db.message.error, undefined)
                else callback(undefined, 'Registo inserido com sucesso')
            })
        } else if (error) callback(error, undefined)
        else if (result) callback(db.message.dataFound, undefined)
    })
}

var UpdateFilmePGRate = (id, rate, callback) => {
    GetFilmePGByRate(rate, (error, result) => {
        if (result) callback(db.message.dataFound, undefined)
        else if (error == db.message.dataNotFound){
            GetFilmePGById(id, (error, result) => {
                if (error) callback(error, undefined)
                else {
                    db.query(`UPDATE ${tabela.tabela} SET ${tabela.rate} = '${rate.toLowerCase()}' WHERE ${tabela.id} = ${id}`, (error, result) => {
                        if (error) callback(db.message.error, undefined)
                        else callback(undefined, 'Registo alterado com sucesso')
                    })
                }
            })
        } else callback(error, undefined)
    })
}

var UpdateFilmePGDescricao = (id, descricao, callback) => {
    GetFilmePGById(id, (error, result) => {
        if (error) callback(error, undefined)
        else {
            db.query(`UPDATE ${tabela.tabela} SET ${tabela.descricao} = '${descricao.toLowerCase()}' WHERE ${tabela.id} = ${id}`, (error, result) => {
                if (error) callback(db.message.error, undefined)
                else callback(undefined, 'Registo alterado com sucesso')
            })
        }
    })
}

var DeleteFilmePG = (id, callback) => {
    GetFilmePGById(id, (error, result) => {
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
    GetAllFilmePGs,
    GetFilmePGById,
    GetFilmePGByRate,
    CreateFilmePG,
    CreateFilmePGRate,
    UpdateFilmePGRate,
    UpdateFilmePGDescricao,
    DeleteFilmePG
}
