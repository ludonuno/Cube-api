//Handle the Desenvolvedor(s) data from the table my_desenvolvedor

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_desenvolvedor',
    id: 'desenvolvedor_id',
    nome: 'desenvolvedor_nome'
}

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetDesenvolvedorTabelData = (id, nome, callback) => {
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
var QueryGetDesenvolvedor = (id, nome, callback) => {
	return new Promise((resolve, reject) => {
		if (id || nome) { // dados internos da tabela
			QueryGetDesenvolvedorTabelData(id, nome, (error, result) => {
				error ? reject(error) : resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${tabela.tabela}`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Create
var QueryCreateDesenvolvedor = (nome, callback) => {
	return new Promise((resolve, reject) => {
        nome ? reject(db.message.dataError) : resolve(`INSERT INTO ${tabela.tabela} (${tabela.nome}) VALUES (${nome}) RETURNING *`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateDesenvolvedor = (id, nome, callback) => {
	return new Promise((resolve, reject) => {
		nome ? reject(db.message.dataError) : resolve(`UPDATE ${tabela.tabela} SET ${tabela.nome} = '${nome}' WHERE ${tabela.id} = ${id} RETURNING *`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeleteDesenvolvedor = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryDesenvolvedor = (id, nome, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetDesenvolvedor(id, nome, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				QueryCreateDesenvolvedor(nome, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
				QueryUpdateDesenvolvedor(id, nome, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
				QueryDeleteDesenvolvedor(id, (error, result) => error ? reject(error) : resolve(result) )
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
var GetDesenvolvedor = (id, nome, callback) => {
  	return new Promise((resolve, reject) => {
		QueryDesenvolvedor(id, nome, 'get', (error, result) => {
			error ? reject(error) :	db.query(result, (error, result) => {
				if (error) reject(db.message.internalError)
				else if (!sizeOf(result)) reject(db.message.dataNotFound)
				else resolve(result)
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
}		

var CreateDesenvolvedor = (nome, callback) => {
	return new Promise((resolve, reject) => {
        GetDesenvolvedor(undefined, nome, (error, result) => {
            if (result) reject(db.message.dataFound)
            else if (error == db.message.dataNotFound) {
                QueryDesenvolvedor(undefined, nome, 'create', (error, result) => {
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

var UpdateDesenvolvedor = (id, ome, callback) => {
	return new Promise((resolve, reject) => {
		GetDesenvolvedor(id, undefined, (error, result) => {
			error ? reject(error) :	QueryDesenvolvedor(id, nome, 'update', (error, result) => {
				error ? reject(error) : db.query(result, (error, result) => {
					error ? reject(db.message.internalError) : resolve({message: "Registo atualizado com sucesso", data: result}) 
				})
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

var DeleteDesenvolvedor = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetDesenvolvedor(id, undefined, (error, result) => {
			error ? reject(error) :	QueryDesenvolvedor(id, undefined, 'delete', (error, result) => {
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
  GetDesenvolvedor,
  CreateDesenvolvedor,
  UpdateDesenvolvedor,
  DeleteDesenvolvedor,
  tabela
};