//Handle the Editora(s) data from the table my_editora

const db = require('./../../db')
const sizeOf = require('object-sizeof')

//TODO: Adicionar a verificação de formatação dos dados nos handlers scripts das tabelas !!!! Atenção aos textos para serem url friendly (ex: terem ? para nao dar erro dos parametros)

const tabela = {
    tabela: 'my_editora',
    id: 'editora_id',
    nome: 'editora_nome'
}

var GetAllEditoras = (callback) => {
    db.query(`SELECT * FROM ${tabela.tabela}`, (error, result) => {
        if (error) callback(db.message.error, undefined)
        else if (!sizeOf(result.rows)) callback(db.message.dataNotFound, undefined)
        else callback(undefined, result.rows)
    })
}

var GetEditoraById = (id, callback) => {
    if (!isNaN(id)) {
        db.query(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`, (error, result) => {
            if (error) callback(db.message.error, undefined)
            else if (!sizeOf(result.rows[0])) callback(db.message.dataNotFound, undefined) //sizeOf is 0?
            else callback(undefined, result.rows[0]) 
        })
    } else callback('O tipo de dado fornecido não é válido', undefined)
}

var GetEditoraByNome = (nome, callback) => {
    db.query(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.nome} LIKE '${nome.toLowerCase()}'`, (error, result) => {
        if (error) callback(db.message.error, undefined)
        else if (!sizeOf(result.rows[0])) callback(db.message.dataNotFound, undefined) //sizeOf is 0?
        else callback(undefined, result.rows[0]) 
    })
}

var CreateEditora = (nome, callback) => {
    GetEditoraByNome(nome, (error, result) => {
        if (error == db.message.dataNotFound) {
            db.query(`INSERT INTO ${tabela.tabela} (${tabela.nome}) VALUES ('${nome.toLowerCase()}')`, (error, result) => {
                if (error) callback(db.message.error, undefined)
                else callback(undefined, 'Registo inserido com sucesso')
            })
        } else if (error) callback(error, undefined)
        else if (result) callback(db.message.dataFound, undefined)
    })
}

var UpdateEditora = (id, nome, callback) => {
    GetEditoraByNome(nome, (error, result) => {
        if (result) callback(db.message.dataFound, undefined)
        else if (error == db.message.dataNotFound){
            GetEditoraById(id, (error, result) => {
                if (error) callback(error, undefined)
                else {
                    db.query(`UPDATE ${tabela.tabela} SET ${tabela.nome} = '${nome.toLowerCase()}' WHERE ${tabela.id} = ${id}`, (error, result) => {
                        if (error) callback(db.message.error, undefined)
                        else callback(undefined, 'Registo alterado com sucesso')
                    })
                }
            })
        } else callback(error, undefined)
    })
}

var DeleteEditora = (id, callback) => {
    GetCategoriaById(id, (error, result) => {
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
    GetAllEditoras,
    GetEditoraById,
    GetEditoraByNome,
    CreateEditora,
    UpdateEditora,
    DeleteEditora
}
