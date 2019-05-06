//Handle the Pessoa(s) data with the API

const db = require("./../../db");
const sizeOf = require("object-sizeof");

const tabela = {
  tabela: "my_pessoa",
  id: "pessoa_id",
  nome: "pessoa_nome",
  foto: "pessoa_foto",
  dataNascimento: "pessoa_data_nascimento",
  biografia: "pessoa_biografia"
};

// Trata dos dados da ação Get que não requerem tabelas externas
var QueryGetPessoaTabelData = (id, nome, dataNascimento, callback) => {
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
		if (dataNascimento) {
			if (numeroParametros) queryParams += ' AND '
			queryParams += `${tabela.dataNascimento} = ${dataNascimento}`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata dos dados da ação Create que não requerem tabelas externas
var QueryCreatePessoaTabelData = (nome, foto, dataNascimento, biografia, callback) => {
	return new Promise((resolve, reject) => {
		let queryParamsTabelas = "",  queryParamsValues = "", numeroParametros = 0
		if (nome) {
			queryParamsTabelas += `${tabela.nome}`
			queryParamsValues += `'${nome}'`
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
		if (dataNascimento) {
			if (numeroParametros) {
				queryParamsTabelas += ', '
				queryParamsValues += ', '
			}
			queryParamsTabelas += `${tabela.dataNascimento}`
			queryParamsValues += `'${dataNascimento}'`
		}
		if (biografia) {
			if (numeroParametros) {
				queryParamsTabelas += ', '
				queryParamsValues += ', '
			}
			biografia = biografia.replace("'", "%27")
			queryParamsTabelas += `${tabela.biografia}`
			queryParamsValues += `'${biografia}'`
		}
		resolve({tables: queryParamsTabelas, values: queryParamsValues})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata dos dados da ação Update que não requerem tabelas externas
var QueryUpdatePessoaTabelData = (nome, foto, dataNascimento, biografia, callback) => {
	return new Promise((resolve, reject) => {
		let queryParams = "",  numeroParametros = 0
		if (nome) {
			queryParams += `${tabela.nome} = '${nome}'`
			numeroParametros++;
		}
		if (foto) {  //TODO: Verificar se é código Hex
			if (numeroParametros) 
				queryParams += ', '
			queryParams += `${tabela.foto} = decode('${foto}', 'hex')`
			numeroParametros++;
		}
		if (dataNascimento) {
			if (numeroParametros) 
				queryParams += ', '
			queryParams += `${tabela.dataNascimento} = ${dataNascimento}`
		}
		if (biografia) {
			if (numeroParametros) 
				queryParams += ', '
			biografia = biografia.replace("'", "%27")
			queryParams += `${tabela.biografia} = '${biografia}'`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Get
var QueryGetPessoa = (id, nome, dataNascimento, callback) => {
	return new Promise((resolve, reject) => {
		if (id || nome || dataNascimento) { // dados internos da tabela
			QueryGetPessoaTabelData(id, nome, dataNascimento, (error, result) => {
				error ? reject(error) : resolve(`SELECT * FROM ${tabela.tabela} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${tabela.tabela}`)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Create
var QueryCreatePessoa = (nome, foto, dataNascimento, biografia, callback) => {
	return new Promise((resolve, reject) => {
		QueryCreatePessoaTabelData(nome, foto, dataNascimento, biografia, (error, result) => {
			error ? reject(error) : resolve(`INSERT INTO ${tabela.tabela} (${result.tables}) VALUES (${result.values})`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Update
var QueryUpdatePessoa = (id, nome, foto, dataNascimento, biografia, callback) => {
	return new Promise((resolve, reject) => {
		QueryUpdatePessoaTabelData(nome, foto, dataNascimento, biografia, (error, result) => {
			error ? reject(error) : resolve(`UPDATE ${tabela.tabela} SET ${result} WHERE ${tabela.id} = ${id}`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Trata da query do método Delete
var QueryDeletePessoa = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	)
}

// Obtem a query dependendo dos dados que são passados
var QueryPessoa = (id, nome, foto, dataNascimento, biografia, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				QueryGetPessoa(id, nome, dataNascimento, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				QueryCreatePessoa(nome, foto, dataNascimento, biografia, (error, result) =>  error ? reject(error) : resolve(result) )
				break;
			case 'update':
				QueryUpdatePessoa(id, nome, foto, dataNascimento, biografia, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
				QueryDeletePessoa(id, (error, result) => error ? reject(error) : resolve(result) )        
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
var GetPessoa = (id, nome, dataNascimento, callback) => {
  	return new Promise((resolve, reject) => {
		QueryPessoa(id, nome, undefined, dataNascimento, undefined, 'get', (error, result) => {
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

var CreatePessoa = (nome, foto, dataNascimento, biografia, callback) => {
	return new Promise((resolve, reject) => {
		QueryPessoa(undefined, nome, foto, dataNascimento, biografia, 'create', (error, result) => {
			if (result) {
				db.query(result, (error, result) => {
					error ? reject(db.message.internalError) : resolve("Registo inserido com sucesso")
				});
			} else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

var UpdatePessoa = (id, nome, foto, dataNascimento, biografia, callback) => {
	return new Promise((resolve, reject) => {
		GetPessoa(id, undefined, undefined, (error, result) => {
			if(result) {
				QueryPessoa(id, nome, foto, dataNascimento, biografia, 'update', (error, result) => {
					if (result) db.query(result, (error, result) => error ? reject(db.message.internalError) : resolve("Registo atualizado com sucesso") )
					else reject(error)
				})
			} else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

var DeletePessoa = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetPessoa(id, undefined, undefined, (error, result) => {
			if(result) {
				QueryPessoa(id, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
					if (result) db.query(result, (error, result) => error ? reject(db.message.internalError) : resolve("Registo apagado com sucesso") )
					else reject(error)
				})
			} else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		err => callback(err, undefined)
	);
};

module.exports = {
  GetPessoa,
  CreatePessoa,
  UpdatePessoa,
  DeletePessoa,
  tabela
};
