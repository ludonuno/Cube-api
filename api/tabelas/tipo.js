//Handle the Tipo(s) data with the API

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_tpo',
    id: 'tipo_id',
    descricao: 'tipo_descricao'
}

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetTipoTabelData = (id, descricao, callback) => {
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
var QueryGetTipo = (id, descricao, callback) => {
	return new Promise((resolve, reject) => {
		if (id || descricao) { // dados internos da tabela
			QueryGetTipoTabelData(id, descricao, (error, result) => {
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
var QueryCreateTipo = (descricao, callback) => {
	return new Promise((resolve, reject) => {
        if (descricao) resolve(`INSERT INTO ${tabela.tabela} (${tabela.descricao}) VALUES (${descricao})`)
        else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateTipo = (id, descricao, callback) => {
	return new Promise((resolve, reject) => {
		if (descricao) resolve(`UPDATE ${tabela.tabela} SET ${tabela.descricao} = '${descricao}' WHERE ${tabela.id} = ${id}`)
		else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeleteTipo = (id, callback) => {
	return new Promise((resolve, reject) => {
		if(!isNaN(Number(id))) resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`)
		else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryTipo = (id, rate, descricao, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetTipo(id, rate, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'create': 
				QueryCreateTipo(rate, descricao, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'update':
				QueryUpdateTipo(id, rate, descricao, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'delete':
				QueryDeleteTipo(id, (error, result) => {
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
var GetTipo = (id, rate, callback) => {
  	return new Promise((resolve, reject) => {
		QueryTipo(id, rate, undefined, 'get', (error, result) => {
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

var CreateTipo = (rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
        GetTipo(undefined, rate, (error, result) => {
            if (result) reject(db.message.dataFound)
            else if (error == db.message.dataNotFound) {
                QueryTipo(undefined, rate, descricao, 'create', (error, result) => {
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

var UpdateTipo = (id, rate, descricao, callback) => {
	return new Promise((resolve, reject) => {
		GetTipo(id, undefined, (error, result) => {
			if(result) {
				QueryTipo(id, rate, descricao, 'update', (error, result) => {
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

var DeleteTipo = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetTipo(id, undefined, (error, result) => {
			if(result) {
				QueryTipo(id, undefined, undefined, 'delete', (error, result) => {
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
  GetTipo,
  CreateTipo,
  UpdateTipo,
  DeleteTipo
};
