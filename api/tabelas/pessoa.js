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

var GetAllPessoas = (callback) => {
    db.query(`SELECT * FROM ${tabela.tabela}`, (error, result) => {
        if (error) callback(db.message.error, undefined)
        else if (!sizeOf(result.rows)) callback(db.message.dataNotFound, undefined)
        else callback(undefined, result.rows)
    })
}

var GetPessoaById = (id, callback) => {
    if (!isNaN(id)) {
        db.query(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`, (error, result) => {
            if (error) callback(db.message.error, undefined)
            else if (!sizeOf(result.rows[0])) callback(db.message.dataNotFound, undefined) //sizeOf is 0?
            else callback(undefined, result.rows[0]) 
        })
    } else callback('O tipo de dado fornecido não é válido', undefined)
}

var GetPessoaByNome = (nome, callback) => {
    db.query(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.nome} LIKE '${nome.toLowerCase()}'`, (error, result) => {
        if (error) callback(db.message.error, undefined)
        else if (!sizeOf(result.rows[0])) callback(db.message.dataNotFound, undefined) //sizeOf is 0?
        else callback(undefined, result.rows[0]) 
    })
}

var GetPessoaByDataNascimento = (dataNascimento, callback) => {
    //TODO: recebe dia/mes/ano junto (um valor só) ou dia/mes/ano separado (dia é uma variavel, mes outra, ano outra)
    db.query(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.dataNascimento} LIKE '${dataNascimento}'`, (error, result) => {
        if (error) callback(db.message.error, undefined)
        else if (!sizeOf(result.rows[0])) callback(db.message.dataNotFound, undefined) //sizeOf is 0?
        else callback(undefined, result.rows[0]) 
    })
}

var CreatePessoa = (nome, foto, dataNascimento, biografia, callback) => {
    db.query(`INSERT INTO ${tabela.tabela} (${tabela.nome},${tabela.foto},${tabela.dataNascimento},${tabela.biografia}) VALUES ('${nome}', ${foto}, ${dataNascimento}, '${biografia}')`, (error, result) => {
        if (error) callback(db.message.error, undefined)
        else callback(undefined, 'Registo inserido com sucesso')
    })
}

var UpdatePessoa = (id, nome, foto, dataNascimento, biografia, callback) => {
    GetPessoaById(id, (error, result) => {
        if (error) callback(error, undefined)
        else {
            //TODO: testar a ver se insere os dados
            db.query(`UPDATE ${tabela.tabela} SET ${tabela.nome} = '${nome}', ${tabela.foto} = '${foto}', ${tabela.dataNascimento} = '${dataNascimento}', ${tabela.biografia} = '${biografia}' WHERE ${tabela.id} = ${id}`, (error, result) => {
                if (error) callback(db.message.error, undefined)
                else callback(undefined, 'Registo alterado com sucesso')
            })
        }
    })
}

var DeletePessoa = (id, callback) => {
    GetPessoaById(id, (error, result) => {
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
    GetAllPessoas,
    GetPessoaById,
    GetPessoaByNome,
    GetPessoaByDataNascimento,
    CreatePessoa,
    UpdatePessoa,
    DeletePessoa
}
