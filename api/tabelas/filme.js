const db = require('./../../db');
const sizeOf = require('object-sizeof');

// Tabelas externas
const slfj = require('./slfj.js');
const categoria = require('./categoria.js');
const saga = require('./saga.js');
const filmePG = require('./filme_pg.js');

const tabela = {
  tabela: 'my_filme',
  id: 'filme_id',
  slfjId: 'slfj_id',
  filmePGId: 'filme_pg_id',
  duracao: 'filme_duracao',
  dataLancamento: 'filme_data_lancamento'
}

// GET - feito
// UPDATE
// CREATE
// DELETE

const queryTabelas = {
	get: `${slfj.tabela.tabela}.${slfj.tabela.id}, ${slfj.tabela.tabela}.${slfj.tabela.titulo}, ${slfj.tabela.tabela}.${slfj.tabela.foto}, ${slfj.tabela.tabela}.${slfj.tabela.sinopse}, ${categoria.tabela.tabela}.${categoria.tabela.descricao}, ${saga.tabela.tabela}.${saga.tabela.nome}, ${tabela.tabela}.${tabela.duracao}, ${tabela.tabela}.${tabela.dataLancamento}, ${filmePG.tabela.tabela}.${filmePG.tabela.rate}`
}

var VerifyExternalTables = (slfjId, titulo, categoriaId, sagaId, filmePGId, callback) => {
	//FIXME: se eu passar (undefined, titulo, undefined, sagaId), slfjId não vai ser pesquisado o titulo vai e se o titulo for valido vai pesquisar pela categoriaId mas como ela é undefined vai dar erro, nao validando a pesquisa do sagaId mais tarde criando um erro na pesquisa
	return new Promise ((resolve, reject) => {
		let numberOfErrors = 0
		if (slfjId) {
			slfj.GetSlfj(slfjId, undefined, undefined, undefined, (error, result) => {
				if (error) numberOfErrors++
				slfj.GetSlfj(undefined, titulo, undefined, undefined, (error, result) => {
					if (error) numberOfErrors++
					categoria.GetCategoria(categoriaId, undefined, (error, result) => {
						if (error) numberOfErrors++
						saga.GetSaga(sagaId, undefined, (error, result) => {
							if (error) numberOfErrors++
							filmePG.GetFilmePG(filmePGId, undefined, (error, result) => {
								if (error) numberOfErrors++
								numberOfErrors ? reject(true) : resolve(true)
							})
						})
					})
				})
			})
		} else if (titulo) {
			slfj.GetSlfj(undefined, titulo, undefined, undefined, (error, result) => {
				if (error) numberOfErrors++
				categoria.GetCategoria(categoriaId, undefined, (error, result) => {
					if (error) numberOfErrors++
					saga.GetSaga(sagaId, undefined, (error, result) => {
						if (error) numberOfErrors++
						filmePG.GetFilmePG(filmePGId, undefined, (error, result) => {
							if (error) numberOfErrors++
							numberOfErrors ? reject(true) : resolve(true)
						})
					})
				})
			})
		} else if (categoriaId) {
			categoria.GetCategoria(categoriaId, undefined, (error, result) => {
				if (error) numberOfErrors++
				saga.GetSaga(sagaId, undefined, (error, result) => {
					if (error) numberOfErrors++
					filmePG.GetFilmePG(filmePGId, undefined, (error, result) => {
						if (error) numberOfErrors++
						numberOfErrors ? reject(true) : resolve(true)
					})
				})
			})
		} else if (sagaId) {
			saga.GetSaga(sagaId, undefined, (error, result) => {
				if (error) numberOfErrors++
				filmePG.GetFilmePG(filmePGId, undefined, (error, result) => {
					if (error) numberOfErrors++
					numberOfErrors ? reject(true) : resolve(true)
				})
			})
		} else if (filmePGId) {
			filmePG.GetFilmePG(filmePGId, undefined, (error, result) => {
				error ? reject(true) : resolve(true)
			})
		} else reject (db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
}

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetFilmeTabelData = (duracaoMin, duracaoMax, dataLancamento, callback) => {
	return new Promise((resolve, reject) => {
		let queryParams = '', numeroParametros = 0
		if(duracaoMin || duracaoMax) {
			if(!isNaN(Number(duracaoMin)) && !isNaN(Number(duracaoMax))) {
				queryParams += `${tabela.tabela}.${tabela.duracao} BETWEEN ${duracaoMin} AND ${duracaoMax}`
				numeroParametros++;
			} else if (!isNaN(Number(duracaoMin))) {
				queryParams += `${tabela.tabela}.${tabela.duracao} >= ${duracaoMin}`
				numeroParametros++;
			} else if (!isNaN(Number(duracaoMax))) {
				queryParams += `${tabela.tabela}.${tabela.duracao} <= ${duracaoMax}`
				numeroParametros++;
			} else reject(db.message.dataError)
		}
		if (dataLancamento) {
			if (numeroParametros) queryParams += ' AND '
			queryParams += `${tabela.tabela}.${tabela.dataLancamento} = ${dataLancamento}`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

var QueryGetFilmeExternalTabelData = (slfjId, titulo, categoriaId, sagaId, callback) => {
	//TODO: 
	return new Promise((resolve, reject) => {
		let queryParams = '',  numeroParametros = 0			
		if (slfjId) {
			queryParams += `${slfj.tabela.tabela}.${slfj.tabela.id} = ${slfjId}`
			numeroParametros++
		}
		if (titulo) {
			if (numeroParametros) queryParams += ', '
			queryParams += `${slfj.tabela.tabela}.${slfj.tabela.titulo} LIKE '%${titulo}%'`
			numeroParametros++
		}
		if (categoriaId) {
			if (numeroParametros) queryParams += ', '
			queryParams += `${slfj.tabela.tabela}.${slfj.tabela.categoriaId} = ${categoriaId}`
			numeroParametros++
		} 
		if (sagaId) {
			if (numeroParametros) queryParams += ', '
			queryParams += `${slfj.tabela.tabela}.${slfj.tabela.sagaId} = ${sagaId}`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

var QueryGetFilmeExternalTabel = (slfjId, titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, callback) => {
	return new Promise((resolve, reject) => {
		VerifyExternalTables(slfjId, titulo, categoriaId, sagaId, filmePGId, (error, result) => {
			error ? reject(error) : QueryGetFilmeExternalTabelData(slfjId, titulo, categoriaId, sagaId, (error, result) => {
				if (error) reject(error)
				else {
					if (duracaoMin || duracaoMax || dataLancamento) {
						let queryExternalData = result
						QueryGetFilmeTabelData(duracaoMin, duracaoMax, dataLancamento, (error, result) => {
							if (error) reject(error)
							else resolve(`SELECT ${queryTabelas.get} FROM ${slfj.tabela.tabela} INNER JOIN ${tabela.tabela} ON ${slfj.tabela.tabela}.${slfj.tabela.id} = ${tabela.tabela}.${tabela.slfjId} INNER JOIN ${saga.tabela.tabela} ON ${slfj.tabela.tabela}.${slfj.tabela.sagaId} = ${saga.tabela.tabela}.${saga.tabela.id} INNER JOIN ${categoria.tabela.tabela} ON ${slfj.tabela.tabela}.${slfj.tabela.categoriaId} = ${categoria.tabela.tabela}.${categoria.tabela.id} INNER JOIN ${filmePG.tabela.tabela} ON ${filmePG.tabela.tabela}.${tabela.filmePGId} = ${tabela.tabela}.${tabela.filmePGId} WHERE ${result} AND ${queryExternalData} GROUP BY (${slfj.tabela.tabela}.${slfj.tabela.id}, ${saga.tabela.tabela}.${saga.tabela.id}, ${categoria.tabela.tabela}.${categoria.tabela.id}, ${filmePG.tabela.tabela}.${filmePG.tabela.id}, ${tabela.tabela}.${tabela.id}) ORDER BY ${slfj.tabela.tabela}.${slfj.tabela.id}`)
						})
					} else resolve(`SELECT ${queryTabelas.get} FROM ${slfj.tabela.tabela} INNER JOIN ${tabela.tabela} ON ${slfj.tabela.tabela}.${slfj.tabela.id} = ${tabela.tabela}.${tabela.slfjId} INNER JOIN ${saga.tabela.tabela} ON ${slfj.tabela.tabela}.${slfj.tabela.sagaId} = ${saga.tabela.tabela}.${saga.tabela.id} INNER JOIN ${categoria.tabela.tabela} ON ${slfj.tabela.tabela}.${slfj.tabela.categoriaId} = ${categoria.tabela.tabela}.${categoria.tabela.id} INNER JOIN ${filmePG.tabela.tabela} ON ${filmePG.tabela.tabela}.${tabela.filmePGId} = ${tabela.tabela}.${tabela.filmePGId} WHERE ${result} GROUP BY (${slfj.tabela.tabela}.${slfj.tabela.id}, ${saga.tabela.tabela}.${saga.tabela.id}, ${categoria.tabela.tabela}.${categoria.tabela.id}, ${filmePG.tabela.tabela}.${filmePG.tabela.id}, ${tabela.tabela}.${tabela.id}) ORDER BY ${slfj.tabela.tabela}.${slfj.tabela.id}`)
				}
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Get
var QueryGetFilme = (slfjId, titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, callback) => {
	console.log(slfjId, titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId)
	return new Promise((resolve, reject) => {
		if (slfjId || titulo || categoriaId || sagaId || filmePGId) { // dados de tabelas externas
			QueryGetFilmeExternalTabel(slfjId, titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, (error, result) => {
				error ? reject(error) : resolve(result)
			})
		} else {
			QueryGetFilmeTabelData(duracaoMin, duracaoMax, dataLancamento, (error, result) => {
				error ? reject(error) : resolve(`SELECT ${queryTabelas.get} FROM ${slfj.tabela.tabela} INNER JOIN ${tabela.tabela} ON ${slfj.tabela.tabela}.${slfj.tabela.id} = ${tabela.tabela}.${tabela.slfjId} INNER JOIN ${saga.tabela.tabela} ON ${slfj.tabela.tabela}.${slfj.tabela.sagaId} = ${saga.tabela.tabela}.${saga.tabela.id} INNER JOIN ${categoria.tabela.tabela} ON ${slfj.tabela.tabela}.${slfj.tabela.categoriaId} = ${categoria.tabela.tabela}.${categoria.tabela.id} INNER JOIN ${filmePG.tabela.tabela} ON ${filmePG.tabela.tabela}.${tabela.filmePGId} = ${tabela.tabela}.${tabela.filmePGId} WHERE ${result} GROUP BY (${slfj.tabela.tabela}.${slfj.tabela.id}, ${saga.tabela.tabela}.${saga.tabela.id}, ${categoria.tabela.tabela}.${categoria.tabela.id}, ${filmePG.tabela.tabela}.${filmePG.tabela.id}, ${tabela.tabela}.${tabela.id}) ORDER BY ${slfj.tabela.tabela}.${slfj.tabela.id}`)
			})
		}
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata dos dados da ação Create que não requerem tabelas externas
var QueryCreateFilmeTabelData = (titulo, foto, sinopse, callback) => {
	return new Promise((resolve, reject) => {
		let queryParamsTabelas = '',  queryParamsValues = '', numeroParametros = 0
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
			sinopse = sinopse.replace("'", '%27')
			queryParamsTabelas += `${tabela.sinopse}`
			queryParamsValues += `'${sinopse}'`
		}
		resolve({tables: queryParamsTabelas, values: queryParamsValues})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Create
var QueryCreateFilme = (titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, callback) => {
	return new Promise((resolve, reject) => {
		VerifyExternalTables(undefined, undefined, categoriaId, sagaId, undefined, (error, result) => {
			error ? reject(error) : QueryCreateFilmeTabelData(titulo, foto, sinopse, (error, result) => {
				error ? reject(error) : resolve(`INSERT INTO ${tabela.tabela} (${result.tables}, ${tabela.categoriaId}, ${tabela.sagaId}) VALUES (${result.values}, ${categoriaId}, ${sagaId}) RETURNING *`)
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata dos dados da ação Update que não requerem tabelas externas
var QueryUpdateFilmeTabelData = (titulo, foto, sinopse, callback) => {
	return new Promise((resolve, reject) => {
		let queryParams = '',  numeroParametros = 0
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
			sinopse = sinopse.replace("'", '%27')
			queryParams += `${tabela.sinopse} = '${sinopse}'`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateFilme = (id, titulo, foto, sinopse, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		if (categoriaId || sagaId) { // dados de tabelas externas
			if(categoriaId && sagaId) {
				VerifyCategoriaSaga(categoriaId, sagaId, (error, result) => {
					error ? reject(error) :	QueryUpdateFilmeTabelData(titulo, foto, sinopse, (error, result) => {
						if(error) reject(error)
						else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result}, ${tabela.categoriaId} = ${categoriaId}, ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id} RETURNING *`)
						else resolve(`UPDATE ${tabela.tabela} SET ${tabela.categoriaId} = ${categoriaId}, ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id} RETURNING *`)
					})
				})
			} else if (categoriaId) {
				categoria.GetCategoria(categoriaId, undefined, (error, result) => {
					error ? reject(error) :	QueryUpdateFilmeTabelData(titulo, foto, sinopse, (error, result) => {
						if(error) reject(error)
						else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result}, ${tabela.categoriaId} = ${categoriaId} WHERE ${tabela.id} = ${id} RETURNING *`)
						else resolve(`UPDATE ${tabela.tabela} SET ${tabela.categoriaId} = ${categoriaId} WHERE ${tabela.id} = ${id} RETURNING *`)
					})
				})
			} else if (sagaId) {
				saga.GetSaga(sagaId, undefined, (error, result) => {
					error ? reject(error) :	QueryUpdateFilmeTabelData(titulo, foto, sinopse, (error, result) => {
						if(error) reject(error)
						else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result}, ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id} RETURNING *`)
						else resolve(`UPDATE ${tabela.tabela} SET ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id} RETURNING *`)
					})
				})
			}
		} else { // dados internos da tabela
			QueryUpdateFilmeTabelData(titulo, foto, sinopse, (error, result) => {
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
var QueryDeleteFilme = (slfjId, callback) => {
	return new Promise((resolve, reject) => {
		slfj.DeleteSlfj(slfjId, (error, result) => error ? reject(error) : resolve(result) )
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryFilme = (slfjId, titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetFilme(slfjId, titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				QueryCreateFilme(titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
				QueryUpdateFilme(slfjId, titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
				QueryDeleteFilme(slfjId, (error, result) => error ? reject(error) : resolve(result) )      
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
var GetFilme = (slfjId, titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, callback) => {
  	return new Promise((resolve, reject) => {
		QueryFilme(slfjId, titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, 'get', (error, result) => {
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

var CreateFilme = (titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, callback) => {
	return new Promise((resolve, reject) => {
		QueryFilme(undefined, titulo, categoriaId, sagaId, duracaoMin, duracaoMax, dataLancamento, filmePGId, 'create', (error, result) => {
			error ? reject(error) : db.query(result, (error, result) => {
				error ? reject(db.message.internalError) : resolve({message: "Registo inserido com sucesso", data: result})
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

var UpdateFilme = (id, titulo, foto, sinopse, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		GetFilme(id, undefined, undefined, undefined, (error, result) => {
			error ? reject(error) :	QueryFilme(id, titulo, foto, sinopse, categoriaId, sagaId, 'update', (error, result) => {
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

var DeleteFilme = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetFilme(id, undefined, undefined, undefined, (error, result) => {
			error ? reject(error) :	QueryFilme(id, undefined, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
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
  GetFilme,
  CreateFilme,
  UpdateFilme,
  DeleteFilme,
  tabela
};
