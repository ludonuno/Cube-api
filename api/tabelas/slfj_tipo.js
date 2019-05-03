const db = require("./../../db");
const sizeOf = require("object-sizeof");

// Tabelas externas
const slfj = require("./slfj.js");
const tipo = require("./tipo.js");

const tabela = {
  tabela: "my_slfj_tipo",
  slfjId: "slfj_id",
  tipoId: "tipo_id"
};

//TODO: Queries para obter filmes por tipo id, obter filmes por 

// Trata da verificação conjunta das tabelas externas
var VerifySlfjTipo = (slfjId, tipoId, callback) => {
	return new Promise ((resolve, reject) => {
		slfj.GetSlfj(slfjId, undefined , undefined, undefined, (error, result) => {
			if (result) {
				tipo.GetTipo(tipoId, undefined, (error, result) => {
					if (result) resolve(true)
					else reject(error);
				});
			} else reject(error);
		});
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
}

// Trata dos dados da ação Create que não requerem tabelas externas
var QueryCreateSlfjTipoTabelData = (titulo, foto, sinopse, callback) => {
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
var QueryUpdateSlfjTipoTabelData = (titulo, foto, sinopse, callback) => {
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
var QueryGetSlfjTipo = (slfjId, tipoId, callback) => {
	return new Promise((resolve, reject) => {
        //se tiver tipoId
		if (slfjId) {
			`SELECT ${slfj.tabela.tabela}.${slfj.tabela.id},
                ${slfj.tabela.tabela}.${slfj.tabela.titulo}, 
                ${slfj.tabela.tabela}.${slfj.tabela.foto},
                ${slfj.tabela.tabela}.${slfj.tabela.sinopse}, 
                ${slfj.tabela.tabela}.${slfj.tabela.categoriaId},
                ${slfj.tabela.tabela}.${slfj.tabela.sagaId}
                FROM ${slfj.tabela.tabela} 
                INNER JOIN ${tabela.tabela} ON ${slfj.tabela.tabela}.${slfj.tabela.id} = ${tabela.tabela}.${tabela.slfjId}
                INNER JOIN ${tipo.tabela.tabela} ON ${tipo.tabela.tabela}.${tipo.tabela.id} = ${tabela.tabela}.${tabela.tipoId}
                WHERE ${tipo.tabela.id} = ${tipoId}
                GROUP BY ${slfj.tabela.tabela}.${slfj.tabela.id}
				ORDER BY ${slfj.tabela.tabela}.${slfj.tabela.id} ASC`
		} else {
			`SELECT ${tipo.tabela.tabela}.${tipo.tabela.id},
                ${tipo.tabela.tabela}.${tipo.tabela.descricao}
                FROM ${tipo.tabela.tabela} 
                INNER JOIN ${tabela.tabela} ON ${tipo.tabela.tabela}.${tipo.tabela.id} = ${tabela.tabela}.${tabela.tipoId}
                INNER JOIN ${tipo.tabela.tabela} ON ${tipo.tabela.tabela}.${tipo.tabela.id} = ${tabela.tabela}.${tabela.tipoId}
                WHERE ${slfj.tabela.id} = ${slfjId}
                GROUP BY ${tipo.tabela.tabela}.${tipo.tabela.id}
                ORDER BY ${tipo.tabela.tabela}.${tipo.tabela.id} ASC`
		}
        
		
		
        
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Create
var QueryCreateSlfjTipo = (titulo, foto, sinopse, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		VerifyCategoriaSaga(categoriaId, sagaId, (error, result) => {
			if (result) {
				QueryCreateSlfjTipoTabelData(titulo, foto, sinopse, (error, result) => {
					if(error) reject(error)
					else if (result) resolve(`INSERT INTO ${tabela.tabela} (${result.tables}, ${tabela.categoriaId}, ${tabela.sagaId}) VALUES (${result.values}, ${categoriaId}, ${sagaId})`)
				})
			} else reject (error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateSlfjTipo = (id, titulo, foto, sinopse, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		if (categoriaId || sagaId) { // dados de tabelas externas
			if(categoriaId && sagaId) {
				VerifyCategoriaSaga(categoriaId, sagaId, (error, result) => {
					if (result) {
						QueryUpdateSlfjTipoTabelData(titulo, foto, sinopse, (error, result) => {
							if(error) reject(error)
							else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result}, ${tabela.categoriaId} = ${categoriaId}, ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id}`)
							else resolve(`UPDATE ${tabela.tabela} SET ${tabela.categoriaId} = ${categoriaId}, ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id}`)
						})
					} else reject (error)
				})
			} else if (categoriaId) {
				categoria.GetCategoria(categoriaId, undefined, (error, result) => {
					if (result) {
						QueryUpdateSlfjTipoTabelData(titulo, foto, sinopse, (error, result) => {
							if(error) reject(error)
							else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result}, ${tabela.categoriaId} = ${categoriaId} WHERE ${tabela.id} = ${id}`)
							else resolve(`UPDATE ${tabela.tabela} SET ${tabela.categoriaId} = ${categoriaId} WHERE ${tabela.id} = ${id}`)
						})
					} else reject (error)
				})
			} else if (sagaId) {
				saga.GetSaga(sagaId, undefined, (error, result) => {
					if (result) {
						QueryUpdateSlfjTipoTabelData(titulo, foto, sinopse, (error, result) => {
							if(error) reject(error)
							else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result}, ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id}`)
							else resolve(`UPDATE ${tabela.tabela} SET ${tabela.sagaId} = ${sagaId} WHERE ${tabela.id} = ${id}`)
						})
					} else reject (error)
				})
			}
		} else { // dados internos da tabela
			QueryUpdateSlfjTipoTabelData(titulo, foto, sinopse, (error, result) => {
				if(error) reject(error)
				else if (result) resolve(`UPDATE ${tabela.tabela} SET ${result} WHERE ${tabela.id} = ${id}`)
				else reject(error)
			})
		}
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeleteSlfjTipo = (id, callback) => {
	return new Promise((resolve, reject) => {
		if(!isNaN(Number(id))) resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`)
		else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QuerySlfjTipo = (id, titulo, foto, sinopse, categoriaId, sagaId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetSlfjTipo(id, titulo, categoriaId, sagaId, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'create': 
				QueryCreateSlfjTipo(titulo, foto, sinopse, categoriaId, sagaId, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'update':
				QueryUpdateSlfjTipo(id, titulo, foto, sinopse, categoriaId, sagaId, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'delete':
				QueryDeleteSlfjTipo(id, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})        
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
var GetSlfjTipo = (id, titulo, categoriaId, sagaId, callback) => {
  	return new Promise((resolve, reject) => {
		QuerySlfjTipo(id, titulo, undefined, undefined, categoriaId, sagaId, 'get', (error, result) => {
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

var CreateSlfjTipo = (titulo, foto, sinopse, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		QuerySlfjTipo(undefined, titulo, foto, sinopse, categoriaId, sagaId, 'create', (error, result) => {
			if (result) {
				db.query(result, (error, result) => {
					if (error) reject(db.message.internalError);
					else resolve("Registo inserido com sucesso");
				});
			} else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

var UpdateSlfjTipo = (id, titulo, foto, sinopse, categoriaId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		GetSlfjTipo(id, undefined, undefined, undefined, (error, result) => {
			if(result) {
				QuerySlfjTipo(id, titulo, foto, sinopse, categoriaId, sagaId, 'update', (error, result) => {
					if (result) {
						db.query(result, (error, result) => {
							if (error) reject(db.message.internalError);
							else resolve("Registo atualizado com sucesso");
						});
					} else reject(error)
				})
			} else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

var DeleteSlfjTipo = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetSlfjTipo(id, undefined, undefined, undefined, (error, result) => {
			if(result) {
				QuerySlfjTipo(id, undefined, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
					if (result) {
						db.query(result, (error, result) => {
							if (error) reject(db.message.internalError);
							else resolve("Registo apagado com sucesso");
						});
					} else reject(error)
				})
			} else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

module.exports = {
  GetSlfjTipo,
  CreateSlfjTipo,
  UpdateSlfjTipo,
  DeleteSlfjTipo
};
