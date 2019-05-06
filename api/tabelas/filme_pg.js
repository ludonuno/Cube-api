//Handle the FilmePG(s) data from the table my_funcao

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_filme_pg',
    id: 'filme_pg_id',
    rate: 'filme_pg_rate',
    descricao: 'filme_pg_descricao'
}

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetFilmePGTabelData = (id, rate, callback) => {
	return new Promise((resolve, reject) => {
		let queryParams = "", numeroParametros = 0
		if(id) {
			if (!isNaN(Number(id))) {
				queryParams += `${tabela.id} = ${id}`
				numeroParametros++;
			} else reject(db.message.dataError)
        }
		if (rate) {
			if (numeroParametros) queryParams += ' AND '
			queryParams += `${tabela.rate} LIKE '%${rate}%'`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata dos dados da ação Create que não requerem tabelas externas
var QueryCreateFilmePGTabelData = (rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		let queryParamsTabelas = "",  queryParamsValues = "", numeroParametros = 0
		if (rate) {
			queryParamsTabelas += `${tabela.rate}`
			queryParamsValues += `'${rate}'`
			numeroParametros++;
		}
		if (descricao) {
			if (numeroParametros) {
				queryParamsTabelas += ', '
				queryParamsValues += ', '
			}
			descricao = descricao.replace("'", "%27")
			queryParamsTabelas += `${tabela.descricao}`
			queryParamsValues += `'${descricao}'`
		}
		resolve({tables: queryParamsTabelas, values: queryParamsValues})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata dos dados da ação Update que não requerem tabelas externas
var QueryUpdateFilmePGTabelData = (rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		let queryParams = "",  numeroParametros = 0
		if (rate) {
			queryParams += `${tabela.rate} = '${rate}'`
			numeroParametros++;
		}
		if (descricao) {
			if (numeroParametros) 
				queryParams += ', '
			descricao = descricao.replace("'", "%27")
			queryParams += `${tabela.descricao} = '${descricao}'`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Get
var QueryGetFilmePG = (id, rate, callback) => {
	return new Promise((resolve, reject) => {
		if (id || rate) { // dados internos da tabela
			QueryGetFilmePGTabelData(id, rate, (error, result) => {
				if(error) reject(error)
				else resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${tabela.tabela}`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Create
var QueryCreateFilmePG = (rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		QueryCreateFilmePGTabelData(rate, descricao, (error, result) => {
			if(error) reject(error)
			else if (result) resolve(`INSERT INTO ${tabela.tabela} (${result.tables}) VALUES (${result.values})`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateFilmePG = (id, rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		QueryUpdateFilmePGTabelData(rate, descricao, (error, result) => {
			if(error) reject(error)
			else resolve(`UPDATE ${tabela.tabela} SET ${result} WHERE ${tabela.id} = ${id}`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeleteFilmePG = (id, callback) => {
	return new Promise((resolve, reject) => {
		if(!isNaN(Number(id))) resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`)
		else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryFilmePG = (id, rate, descricao, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetFilmePG(id, rate, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'create': 
				QueryCreateFilmePG(rate, descricao, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'update':
				QueryUpdateFilmePG(id, rate, descricao, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'delete':
				QueryDeleteFilmePG(id, (error, result) => {
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
var GetFilmePG = (id, rate, callback) => {
  	return new Promise((resolve, reject) => {
		QueryFilmePG(id, rate, undefined, 'get', (error, result) => {
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

var CreateFilmePG = (rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
        GetFilmePG(undefined, rate, (error, result) => {
            if (result) reject(db.message.dataFound)
            else if (error == db.message.dataNotFound) {
                QueryFilmePG(undefined, rate, descricao, 'create', (error, result) => {
                    if (result) {
                        db.query(result, (error, result) => {
                            if (error) reject(db.message.internalError);
                            else resolve("Registo inserido com sucesso");
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

var UpdateFilmePG = (id, rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		GetFilmePG(id, undefined, (error, result) => {
			if(result) {
				QueryFilmePG(id, rate, descricao, 'update', (error, result) => {
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

var DeleteFilmePG = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetFilmePG(id, undefined, (error, result) => {
			if(result) {
				QueryFilmePG(id, undefined, undefined, 'delete', (error, result) => {
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
  GetFilmePG,
  CreateFilmePG,
  UpdateFilmePG,
  DeleteFilmePG,
  tabela
};