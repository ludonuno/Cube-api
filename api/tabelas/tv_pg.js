//Handle the TvPG(s) data from the table my_tv_pg

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_tv_pg',
    id: 'tv_pg_id',
    rate: 'tv_pg_rate',
    descricao: 'tv_pg_descricao'
}

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetTvPGTabelData = (id, rate, callback) => {
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
var QueryCreateTvPGTabelData = (rate, descricao, callback) => {
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
var QueryUpdateTvPGTabelData = (rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		if(rate || descricao) {
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
		} else reject(undefined)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Get
var QueryGetTvPG = (id, rate, callback) => {
	return new Promise((resolve, reject) => {
		if (id || rate) { // dados internos da tabela
			QueryGetTvPGTabelData(id, rate, (error, result) => {
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
var QueryCreateTvPG = (rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		QueryCreateTvPGTabelData(rate, descricao, (error, result) => {
            if(error) reject(error)
			else if (result) resolve(`INSERT INTO ${tabela.tabela} (${result.tables}) VALUES (${result.values})`)
        })
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateTvPG = (id, rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		QueryUpdateTvPGTabelData(rate, descricao, (error, result) => {
			if(error) reject(error)
			else resolve(`UPDATE ${tabela.tabela} SET ${result} WHERE ${tabela.id} = ${id}`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeleteTvPG = (id, callback) => {
	return new Promise((resolve, reject) => {
		if(!isNaN(Number(id))) resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`)
		else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryTvPG = (id, rate, descricao, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetTvPG(id, rate, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'create': 
				QueryCreateTvPG(rate, descricao, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'update':
				QueryUpdateTvPG(id, rate, descricao, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'delete':
				QueryDeleteTvPG(id, (error, result) => {
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
var GetTvPG = (id, rate, callback) => {
  	return new Promise((resolve, reject) => {
		QueryTvPG(id, rate, undefined, 'get', (error, result) => {
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

var CreateTvPG = (rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
        GetTvPG(undefined, rate, (error, result) => {
            if (result) reject(db.message.dataFound)
            else if (error == db.message.dataNotFound) {
                QueryTvPG(undefined, rate, descricao, 'create', (error, result) => {
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

var UpdateTvPG = (id, rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		GetTvPG(id, undefined, (error, result) => {
			if(result) {
				QueryTvPG(id, rate, descricao, 'update', (error, result) => {
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

var DeleteTvPG = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetTvPG(id, undefined, (error, result) => {
			if(result) {
				QueryTvPG(id, undefined, undefined, 'delete', (error, result) => {
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
  GetTvPG,
  CreateTvPG,
  UpdateTvPG,
  DeleteTvPG,
  tabela
};
