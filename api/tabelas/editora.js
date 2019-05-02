//Handle the Editora(s) data from the table my_editora

const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabela = {
    tabela: 'my_editora',
    id: 'editora_id',
    nome: 'editora_nome'
}

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetEditoraTabelData = (id, nome, callback) => {
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
var QueryGetEditora = (id, nome, callback) => {
	return new Promise((resolve, reject) => {
		if (id || nome) { // dados internos da tabela
			QueryGetEditoraTabelData(id, nome, (error, result) => {
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
var QueryCreateEditora = (nome, callback) => {
	return new Promise((resolve, reject) => {
        if (nome) resolve(`INSERT INTO ${tabela.tabela} (${tabela.nome}) VALUES (${nome})`)
        else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdateEditora = (id, nome, callback) => {
	return new Promise((resolve, reject) => {
		if (nome) resolve(`UPDATE ${tabela.tabela} SET ${tabela.nome} = '${nome}' WHERE ${tabela.id} = ${id}`)
		else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeleteEditora = (id, callback) => {
	return new Promise((resolve, reject) => {
		if(!isNaN(Number(id))) resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`)
		else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryEditora = (id, nome, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetEditora(id, nome, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'create': 
				QueryCreateEditora(nome, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'update':
				QueryUpdateEditora(id, nome, (error, result) => {
					if(result) resolve(result)
					else reject(error)
				})
				break;
			case 'delete':
				QueryDeleteEditora(id, (error, result) => {
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
var GetEditora = (id, nome, callback) => {
  	return new Promise((resolve, reject) => {
		QueryEditora(id, nome, 'get', (error, result) => {
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

var CreateEditora = (nome, callback) => {
	return new Promise((resolve, reject) => {
        GetEditora(undefined, nome, (error, result) => {
            if (result) reject(db.message.dataFound)
            else if (error == db.message.dataNotFound) {
                QueryEditora(undefined, nome, 'create', (error, result) => {
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

var UpdateEditora = (id, ome, callback) => {
	return new Promise((resolve, reject) => {
		GetEditora(id, undefined, (error, result) => {
			if(result) {
				QueryEditora(id, nome, 'update', (error, result) => {
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

var DeleteEditora = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetEditora(id, undefined, (error, result) => {
			if(result) {
				QueryEditora(id, undefined, 'delete', (error, result) => {
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
  GetEditora,
  CreateEditora,
  UpdateEditora,
  DeleteEditora
};