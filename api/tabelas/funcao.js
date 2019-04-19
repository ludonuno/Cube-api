//Handle the Funcao(oes) data from the table my_funcao

const db = require('./../../db')
const sizeOf = require('object-sizeof')

//TODO: Adicionar a verificação de formatação dos dados nos handlers scripts das tabelas !!!! Atenção aos textos para serem url friendly (ex: terem ? para nao dar erro dos parametros)

const tabela = {
    tabela: 'my_funcao',
    id: 'funcao_id',
    descricao: 'funcao_descricao'
}

var GetAllFuncoes = (callback) => {
    db.query(`SELECT * FROM ${tabela.tabela}`, (error, result) => {
        if (error) callback(db.message.error, undefined)
        else if (!sizeOf(result.rows)) callback(db.message.dataNotFound, undefined)
        else callback(undefined, result.rows)
    })
}

var GetFuncaoById = (id, callback) => {
    if (!isNaN(id)) {
        db.query(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`, (error, result) => {
            if (error) callback(db.message.error, undefined)
            else if (!sizeOf(result.rows[0])) callback(db.message.dataNotFound, undefined) //sizeOf is 0?
            else callback(undefined, result.rows[0]) 
        })
    } else callback('O tipo de dado fornecido não é válido', undefined)
}

var GetFuncaoByDescricao = (descricao, callback) => {
    db.query(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.descricao} LIKE '${descricao.toLowerCase()}'`, (error, result) => {
        if (error) callback(db.message.error, undefined)
        else if (!sizeOf(result.rows[0])) callback(db.message.dataNotFound, undefined) //sizeOf is 0?
        else callback(undefined, result.rows[0]) 
    })
}

var CreateFuncao = (descricao, callback) => {
    GetFuncaoByDescricao(descricao, (error, result) => {
        if (error == db.message.dataNotFound) {
            db.query(`INSERT INTO ${tabela.tabela} (${tabela.descricao}) VALUES ('${descricao.toLowerCase()}')`, (error, result) => {
                if (error) callback(db.message.error, undefined)
                else callback(undefined, 'Registo inserido com sucesso')
            })
        } else if (error) callback(error, undefined)
        else if (result) callback(db.message.dataFound, undefined)
    })
}

var UpdateFuncao = (id, descricao, callback) => {
    GetFuncaoByDescricao(descricao, (error, result) => {
        if (result) callback(db.message.dataFound, undefined)
        else if (error == db.message.dataNotFound){
            GetFuncaoById(id, (error, result) => {
                if (error) callback(error, undefined)
                else {
                    db.query(`UPDATE ${tabela.tabela} SET ${tabela.descricao} = '${descricao.toLowerCase()}' WHERE ${tabela.id} = ${id}`, (error, result) => {
                        if (error) callback(db.message.error, undefined)
                        else callback(undefined, 'Registo alterado com sucesso')
                    })
                }
            })
        } else callback(error, undefined)
    })
}

var DeleteFuncao = (id, callback) => {
    GetFuncaoById(id, (error, result) => {
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
    GetAllFuncoes,
    GetFuncaoById,
    GetFuncaoByDescricao,
    CreateFuncao,
    UpdateFuncao,
    DeleteFuncao
}

