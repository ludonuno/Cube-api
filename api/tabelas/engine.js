//Handle the Engine(s) data from the table my_engine

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_engine',
    id: 'engine_id',
    nome: 'engine_nome'
}

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetEngineTabelData = (id, nome, callback) => {
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
var QueryGetEngine = (id, nome, callback) => {
	return new Promise((resolve, reject) => {
		if (id || nome) { // dados internos da tabela
			QueryGetEngineTabelData(id, nome, (error, result) => {
				error ? reject(error) : resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${tabela.tabela}`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Create
var QueryCreateEngine = (nome, callback) => {
	return new Promise((resolve, reject) => {
        error ? reject(db.message.dataError) : resolve(`INSERT INTO ${tabela.tabela} (${tabela.nome}) VALUES (${nome}) RETURNING *`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateEngine = (id, nome, callback) => {
	return new Promise((resolve, reject) => {
		nome ? resolve(`UPDATE ${tabela.tabela} SET ${tabela.nome} = '${nome}' WHERE ${tabela.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeleteEngine = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryEngine = (id, nome, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetEngine(id, nome, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				QueryCreateEngine(nome, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
				QueryUpdateEngine(id, nome, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
				QueryDeleteEngine(id, (error, result) => error ? reject(error) : resolve(result) )
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
var GetEngine = (id, nome, callback) => {
  	return new Promise((resolve, reject) => {
		QueryEngine(id, nome, 'get', (error, result) => {
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

var CreateEngine = (nome, callback) => {
	return new Promise((resolve, reject) => {
        GetEngine(undefined, nome, (error, result) => {
            if (result) reject(db.message.dataFound)
            else if (error == db.message.dataNotFound) {
                QueryEngine(undefined, nome, 'create', (error, result) => {
					error ? reject(error) : db.query(result, (error, result) => {
						error ? reject(db.message.internalError) : resolve({message: "Registo inserido com sucesso", data: result})
					})
                })
            } else reject(error)
        })
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

var UpdateEngine = (id, ome, callback) => {
	return new Promise((resolve, reject) => {
		GetEngine(id, undefined, (error, result) => {
			error ? reject(error) : QueryEngine(id, nome, 'update', (error, result) => {
				error ? reject(error) : db.query(result, (error, result) => {
					error ? reject(error) : resolve({message: "Registo atualizado com sucesso", data: result})
				})
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

var DeleteEngine = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetEngine(id, undefined, (error, result) => {
			error ? reject(error) :	QueryEngine(id, undefined, 'delete', (error, result) => {
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
  GetEngine,
  CreateEngine,
  UpdateEngine,
  DeleteEngine,
  tabela
};