const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_publicador',
    id: 'publicador_id',
    nome: 'publicador_nome'
}

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetPublicadorTabelData = (id, nome, callback) => {
	return new Promise((resolve, reject) => {
        let queryParams = "", numeroParametros = 0
        if(id) {
            if (!isNaN(Number(id))) {
                queryParams += `${tabela.id} = ${id}`
                numeroParametros++;
            } else reject(db.message.dataError)            
        }
		if (nome) {
			if (numeroParametros) queryParams += ' AND '
			queryParams += `${tabela.nome} LIKE '%${nome}%'`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Get
var QueryGetPublicador = (id, nome, callback) => {
	return new Promise((resolve, reject) => {
		if (id || nome) { // dados internos da tabela
			QueryGetPublicadorTabelData(id, nome, (error, result) => {
				error ? reject(error) : resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${tabela.tabela}`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Create
var QueryCreatePublicador = (nome, callback) => {
	return new Promise((resolve, reject) => {
        nome ? resolve(`INSERT INTO ${tabela.tabela} (${tabela.nome}) VALUES (${nome}) RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdatePublicador = (id, nome, callback) => {
	return new Promise((resolve, reject) => {
		nome ? resolve(`UPDATE ${tabela.tabela} SET ${tabela.nome} = '${nome}' WHERE ${tabela.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeletePublicador = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryPublicador = (id, nome, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetPublicador(id, nome, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				QueryCreatePublicador(nome, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
				QueryUpdatePublicador(id, nome, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
				QueryDeletePublicador(id, (error, result) => error ? reject(error) : resolve(result) )
				break;
			default:
				reject(db.message.dataError)
				break;
		}
  	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

//Exports
var GetPublicador = (id, nome, callback) => {
  	return new Promise((resolve, reject) => {
		QueryPublicador(id, nome, 'get', (error, result) => {
			error ? reject(error) :	db.query(result, (error, result) => {
				if (error) reject(db.message.internalError)
				else if (!sizeOf(result)) reject(db.message.dataNotFound)
				else resolve(result)
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}		

var CreatePublicador = (nome, callback) => {
	return new Promise((resolve, reject) => {
        GetPublicador(undefined, nome, (error, result) => {
            if (result) reject(db.message.dataFound)
            else if (error == db.message.dataNotFound) {
                QueryPublicador(undefined, nome, 'create', (error, result) => {
                    error ? reject(error) : db.query(result, (error, result) => {
						error ? reject(db.message.internalError) : resolve({message: "Registo inserido com sucesso", data: result})
					})
                })
            } else reject(error)
        })
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

var UpdatePublicador = (id, ome, callback) => {
	return new Promise((resolve, reject) => {
		GetPublicador(id, undefined, (error, result) => {
			error ? reject(error) :	QueryPublicador(id, nome, 'update', (error, result) => {
				error ? reject(error) : db.query(result, (error, result) => {
					error ? reject(db.message.internalError) : resolve({message: "Registo atualizado com sucesso", data: result}) 
				})
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

var DeletePublicador = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetPublicador(id, undefined, (error, result) => {
			error ? reject(error) :	QueryPublicador(id, undefined, 'delete', (error, result) => {
				error ? reject(error) : db.query(result, (error, result) => {
					error ? reject(db.message.internalError) : resolve({message: "Registo apagado com sucesso", data: result}) 
				})
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

module.exports = {
  GetPublicador,
  CreatePublicador,
  UpdatePublicador,
  DeletePublicador,
  tabela
};