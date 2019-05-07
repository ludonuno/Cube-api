const db = require("./../../db");
const sizeOf = require("object-sizeof");

// Tabelas externas
const categoria = require("./categoria.js");
const saga = require("./saga.js");

const tabela = {
  tabela: "my_slfj",
  id: "slfj_id",
  titulo: "slfj_titulo",
  foto: "slfj_foto",
  sinopse: "slfj_sinopse",
  categoriaId: "categoria_id",
  sagaId: "saga_id"
};

// Trata da verificação conjunta das tabelas externas
var VerifyCategoriaSaga = (categoriaId, sagaId, callback) => {
	return new Promise ((resolve, reject) => {
		categoria.GetCategoria(categoriaId, undefined, (error, result) => { 
			error ? reject(error) : saga.GetSaga(sagaId, undefined, (error, result) => {
				error ? reject(error) : resolve(true)
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetSlfjTabelData = (id, titulo, callback) => {
	return new Promise((resolve, reject) => {
		let queryParams = "", numeroParametros = 0
		if(id) {
			if (!isNaN(Number(id))) {
				queryParams += `${tabela.id} = ${id}`
				numeroParametros++;
			} else reject(db.message.dataError)
		}
		if (titulo) {
			if (numeroParametros) queryParams += ' AND '
			queryParams += `${tabela.titulo} LIKE '%${titulo}%'`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

var QueryGetSlfjExternalTabelData = (id, titulo, categoriaId, sagaId, callback) => {
	//TODO: modificar para ficar como o filme.js
	return new Promise((resolve, reject) => {
		if(categoriaId && sagaId) {
			VerifyCategoriaSaga(categoriaId, sagaId, (error, result) => {
				error ? reject(error) :	QueryGetSlfjTabelData(id, titulo, (error, result) => {
					if(error) reject(error)
					else if (result)resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result} AND ${tabela.categoriaId} = ${categoriaId} AND ${tabela.sagaId} = ${sagaId}`)
					else resolve(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.categoriaId} = ${categoriaId} AND ${tabela.sagaId} = ${sagaId}`)
				})
			})
		} else if (categoriaId) {
			categoria.GetCategoria(categoriaId, undefined, (error, result) => {
				error ? reject(error) : QueryGetSlfjTabelData(id, titulo, (error, result) => {
					if(error) reject(error)
					else if (result) resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result} AND ${tabela.categoriaId} = ${categoriaId}`)
					else resolve(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.categoriaId} = ${categoriaId}`)
				})
			})
		} else {
			saga.GetSaga(sagaId, undefined, (error, result) => {
				error ? reject(error) :	QueryGetSlfjTabelData(id, titulo, (error, result) => {
					if(error) reject(error)
					else if (result) resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result} AND ${tabela.sagaId} = ${sagaId}`)
					else resolve(`SELECT * FROM ${tabela.tabela} WHERE ${tabela.sagaId} = ${sagaId}`)
				})
			})
		}
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata dos dados da ação Create que não requerem tabelas externas
var QueryCreateSlfjTabelData = (titulo, foto, sinopse, callback) => {
	return new Promise((resolve, reject) => {
		let queryParamsTabelas = "",  queryParamsValues = "", numeroParametros = 0
		if (titulo) {
			queryParamsTabelas += `${tabela.titulo}`
			queryParamsValues += `'${titulo}'`
			numeroParametros++;
		}
		if (foto) { //TODO: Verificar se é código Hex
			if (numeroParametros) {
				queryParamsTabelas += ', '
				queryParamsValues += ', '
			}
			queryParamsTabelas += `${tabela.foto}`
			queryParamsValues += `decode('${foto}', 'hex')`
			numeroParametros++;
		}
		if (sinopse) {
			if (numeroParametros) {
				queryParamsTabelas += ', '
				queryParamsValues += ', '
			}
			sinopse = sinopse.replace("'", "%27")
			queryParamsTabelas += `${tabela.sinopse}`
			queryParamsValues += `'${sinopse}'`
		}
		resolve({tables: queryParamsTabelas, values: queryParamsValues})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata dos dados da ação Update que não requerem tabelas externas
var QueryUpdateSlfjTabelData = (titulo, foto, sinopse, callback) => {
	return new Promise((resolve, reject) => {
		let queryParams = "",  numeroParametros = 0
		if (titulo) {
			queryParams += `${tabela.titulo} = '${titulo}'`
			numeroParametros++;
		}
		if (foto) { //TODO: Verificar se é código Hex
			if (numeroParametros) 
				queryParams += ', '
			queryParams += `${tabela.foto} = decode('${foto}', 'hex')`
			numeroParametros++;
		}
		if (sinopse) {
			if (numeroParametros) 
				queryParams += ', '
			sinopse = sinopse.replace("'", "%27")
			queryParams += `${tabela.sinopse} = '${sinopse}'`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Get
var QueryGetSlfj = (id, titulo, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		if (categoriaId || sagaId) { // dados de tabelas externas
			QueryGetSlfjExternalTabelData(id, titulo, categoriaId, sagaId, (error, result) => {
				error ? reject(error) : resolve(result)
			})
		} else if (id || titulo) { // dados internos da tabela
			QueryGetSlfjTabelData(id, titulo, (error, result) => {
				error ? reject(error) : resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${tabela.tabela}`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Create
var QueryCreateSlfj = (titulo, foto, sinopse, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		VerifyCategoriaSaga(categoriaId, sagaId, (error, result) => {
			error ? reject(error) : QueryCreateSlfjTabelData(titulo, foto, sinopse, (error, result) => {
				error ? reject(error) : resolve(`INSERT INTO ${tabela.tabela} (${result.tables}, ${tabela.categoriaId}, ${tabela.sagaId}) VALUES (${result.values}, ${categoriaId}, ${sagaId}) RETURNING *`)
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateSlfj = (id, titulo, foto, sinopse, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		if (categoriaId || sagaId) { // dados de tabelas externas
			if(categoriaId && sagaId) {
				VerifyCategoriaSaga(categoriaId, sagaId, (error, result) => {
					if (result) {
						QueryUpdateSlfjTabelData(titulo, foto, sinopse, (error, result) => {
							if(error) reject(error)
							else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result}, ${tabela.categoriaId} = ${categoriaId}, ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id} RETURNING *`)
							else resolve(`UPDATE ${tabela.tabela} SET ${tabela.categoriaId} = ${categoriaId}, ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id} RETURNING *`)
						})
					} else reject (error)
				})
			} else if (categoriaId) {
				categoria.GetCategoria(categoriaId, undefined, (error, result) => {
					if (result) {
						QueryUpdateSlfjTabelData(titulo, foto, sinopse, (error, result) => {
							if(error) reject(error)
							else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result}, ${tabela.categoriaId} = ${categoriaId} WHERE ${tabela.id} = ${id} RETURNING *`)
							else resolve(`UPDATE ${tabela.tabela} SET ${tabela.categoriaId} = ${categoriaId} WHERE ${tabela.id} = ${id} RETURNING *`)
						})
					} else reject (error)
				})
			} else if (sagaId) {
				saga.GetSaga(sagaId, undefined, (error, result) => {
					if (result) {
						QueryUpdateSlfjTabelData(titulo, foto, sinopse, (error, result) => {
							if(error) reject(error)
							else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result}, ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id} RETURNING *`)
							else resolve(`UPDATE ${tabela.tabela} SET ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id} RETURNING *`)
						})
					} else reject (error)
				})
			}
		} else { // dados internos da tabela
			QueryUpdateSlfjTabelData(titulo, foto, sinopse, (error, result) => {
				if(error) reject(error)
				else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result} WHERE ${tabela.id} = ${id} RETURNING *`)
				else reject(error)
			})
		}
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeleteSlfj = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QuerySlfj = (id, titulo, foto, sinopse, categoriaId, sagaId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetSlfj(id, titulo, categoriaId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				QueryCreateSlfj(titulo, foto, sinopse, categoriaId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
				QueryUpdateSlfj(id, titulo, foto, sinopse, categoriaId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
				QueryDeleteSlfj(id, (error, result) => error ? reject(error) : resolve(result) )
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
var GetSlfj = (id, titulo, categoriaId, sagaId, callback) => {
  	return new Promise((resolve, reject) => {
		QuerySlfj(id, titulo, undefined, undefined, categoriaId, sagaId, 'get', (error, result) => {
			if (result) {
				db.query(result, (error, result) => {
					if (error) reject(db.message.internalError);
					else if (!sizeOf(result)) reject(db.message.dataNotFound);
					else resolve(result);
				});
			} else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
}		

var CreateSlfj = (titulo, foto, sinopse, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		QuerySlfj(undefined, titulo, foto, sinopse, categoriaId, sagaId, 'create', (error, result) => {
			error ? reject(error) : db.query(result, (error, result) => {
				error ? reject(db.message.internalError) : resolve({message: "Registo inserido com sucesso", data: result}) 
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

var UpdateSlfj = (id, titulo, foto, sinopse, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		GetSlfj(id, undefined, undefined, undefined, (error, result) => {
			if(result) {
				QuerySlfj(id, titulo, foto, sinopse, categoriaId, sagaId, 'update', (error, result) => {
					error ? reject(error) : db.query(result, (error, result) => {
						error ? reject(db.message.internalError) : resolve({message: "Registo atualizado com sucesso", data: result}) 
					})
				})
			} else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

var DeleteSlfj = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetSlfj(id, undefined, undefined, undefined, (error, result) => {
			if(result) {
				QuerySlfj(id, undefined, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
					error ? reject(error) : db.query(result, (error, result) => {
						error ? reject(db.message.internalError) : resolve({message: "Registo apagado com sucesso", data: result}) 
					})
				})
			} else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

module.exports = {
  GetSlfj,
  CreateSlfj,
  UpdateSlfj,
  DeleteSlfj,
  tabela
};
