//Handle the Funcao(oes) data from the table my_funcao

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_funcao',
    id: 'funcao_id',
    descricao: 'funcao_descricao'
}

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetFuncaoTabelData = (id, descricao, callback) => {
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
var QueryGetFuncao = (id, descricao, callback) => {
	return new Promise((resolve, reject) => {
		if (id || descricao) { // dados internos da tabela
			QueryGetFuncaoTabelData(id, descricao, (error, result) => {
				error ? reject(error) : resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${tabela.tabela}`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Create
var QueryCreateFuncao = (descricao, callback) => {
	return new Promise((resolve, reject) => {
        descricao ? resolve(`INSERT INTO ${tabela.tabela} (${tabela.descricao}) VALUES (${descricao}) RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateFuncao = (id, descricao, callback) => {
	return new Promise((resolve, reject) => {
		descricao ? resolve(`UPDATE ${tabela.tabela} SET ${tabela.descricao} = '${descricao}' WHERE ${tabela.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeleteFuncao = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryFuncao = (id, rate, descricao, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetFuncao(id, rate, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				QueryCreateFuncao(rate, descricao, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
				QueryUpdateFuncao(id, rate, descricao, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
				QueryDeleteFuncao(id, (error, result) => error ? reject(error) : resolve(result) )
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
var GetFuncao = (id, rate, callback) => {
  	return new Promise((resolve, reject) => {
		QueryFuncao(id, rate, undefined, 'get', (error, result) => {
			error ? reject(error) : db.query(result, (error, result) => {
				if (error) reject(db.message.internalError);
				else if (!sizeOf(result)) reject(db.message.dataNotFound);
				else resolve(result);
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
}		

var CreateFuncao = (rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
        GetFuncao(undefined, rate, (error, result) => {
            if (result) reject(db.message.dataFound)
            else if (error == db.message.dataNotFound) {
                QueryFuncao(undefined, rate, descricao, 'create', (error, result) => {
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

var UpdateFuncao = (id, rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		GetFuncao(id, undefined, (error, result) => {
			error ? reject(error) : QueryFuncao(id, rate, descricao, 'update', (error, result) => {
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

var DeleteFuncao = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetFuncao(id, undefined, (error, result) => {
			error ? reject(error) :	QueryFuncao(id, undefined, undefined, 'delete', (error, result) => {
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
  GetFuncao,
  CreateFuncao,
  UpdateFuncao,
  DeleteFuncao,
  tabela
};