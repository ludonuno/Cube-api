//Handle the Categoria(s) data from the table my_categoria

const db = require("./../../db");
const sizeOf = require("object-sizeof");

const tabela = {
	tabela: "my_categoria",
	id: "categoria_id",
	descricao: "categoria_descricao"
};

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetCategoriaTabelData = (id, descricao, callback) => {
	return new Promise((resolve, reject) => {
		let queryParams = "", numeroParametros = 0
		if(id) {
			if (!isNaN(Number(id))) {
				queryParams += `${tabela.id} = ${id}`
				numeroParametros++;
			} else reject(db.message.dataError)
		}
		if (descricao) {
			if (numeroParametros) queryParams += ' AND '
			queryParams += `${tabela.descricao} LIKE '%${descricao}%'`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Get
var QueryGetCategoria = (id, descricao, callback) => {
	return new Promise((resolve, reject) => {
		if (id || descricao) { // dados internos da tabela
			QueryGetCategoriaTabelData(id, descricao, (error, result) => {
				error ? reject(error) : resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${tabela.tabela}`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Create
var QueryCreateCategoria = (descricao, callback) => {
	return new Promise((resolve, reject) => {
		descricao ? reject(db.message.dataError) : resolve(`INSERT INTO ${tabela.tabela} (${tabela.descricao}) VALUES ('${descricao}') RETURNING *`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateCategoria = (id, descricao, callback) => {
	return new Promise((resolve, reject) => {
		descricao ? reject(db.message.dataError) : resolve(`UPDATE ${tabela.tabela} SET ${tabela.descricao} = '${descricao}' WHERE ${tabela.id} = ${id} RETURNING *`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeleteCategoria = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryCategoria = (id, descricao, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetCategoria(id, descricao, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				QueryCreateCategoria(descricao, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
				QueryUpdateCategoria(id, descricao, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
				QueryDeleteCategoria(id, (error, result) => error ? reject(error) : resolve(result) )
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
var GetCategoria = (id, descricao, callback) => {
  	return new Promise((resolve, reject) => {
		QueryCategoria(id, descricao, 'get', (error, result) => {
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

var CreateCategoria = (descricao, callback) => {
	return new Promise((resolve, reject) => {
		GetCategoria(undefined, descricao, (error, result) => {
			if (result) reject(db.message.dataFound)
			else if (error == db.message.dataNotFound) {
				QueryCategoria(undefined, descricao, 'create', (error, result) => {
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

var UpdateCategoria = (id, descricao, callback) => {
	return new Promise((resolve, reject) => {
		GetCategoria(id, undefined, (error, result) => {
			error ? reject(error) :	QueryCategoria(id, descricao, 'update', (error, result) => {
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

var DeleteCategoria = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetCategoria(id, undefined, (error, result) => {
			error ? reject(error) :	QueryCategoria(id, undefined, 'delete', (error, result) => {
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
  GetCategoria,
  CreateCategoria,
  UpdateCategoria,
  DeleteCategoria,
  tabela
};