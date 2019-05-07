const db = require('./../../db')
const sizeOf = require('object-sizeof')

const tabel = {
    tabel: 'my_Company',
    id: 'id',
    name: 'name'
}

var HandleSelectData = (id, name, callback) => {
	return new Promise((resolve, reject) => {
        let queryParams = "", numberParameters = 0
        
        if(id) {
            if (!isNaN(Number(id))) {
                queryParams += `${tabel.id} = ${id}`
                numberParameters++;
            } else reject(db.message.dataError)            
        }

        if (name) {
			if (numberParameters) queryParams += ' AND '
			queryParams += `${tabela.name} LIKE '%${name}%'`
		}
		resolve(queryParams)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, name, callback) => {
	return new Promise((resolve, reject) => {
		if (id || name) {
			HandleSelectData(id, name, (error, result) => {
				error ? reject(error) : resolve(`SELECT * FROM ${tabel.tabel} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${tabel.tabel}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//TODO:
var HandleInsertData = (rate, description, callback) => {
	return new Promise((resolve, reject) => {
        let queryParamsTabels = '', queryParamsValues = '', numberParameters = 0

		if (rate) {
			queryParamsTabels += `${tabel.rate}`
			queryParamsValues += `'${rate}'`
			numberParameters++;
		}

		if (description) {
			if (numberParameters) {
				queryParamsTabels += ', '
				queryParamsValues += ', '
			}
			description = description.replace("'", '%27')
			queryParamsTabels += `${tabel.description}`
			queryParamsValues += `'${description}'`
		}

		resolve({queryParamsTabels, queryParamsValues})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (name, callback) => {
	return new Promise((resolve, reject) => {
        name ? resolve(`INSERT INTO ${tabel.tabel} (${tabel.name}) VALUES ('${name}') RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//TODO:
var HandleUpdateData = (id, rate, description, callback) => {
	return new Promise((resolve, reject) => {
        let queryParams = '', numberParameters = 0
		if(id) {
            if (!isNaN(Number(id))) {
                queryParams += `${tabel.id} = ${id}`
            } else reject(db.message.dataError)            
		}
		
		if (rate) {
			queryParamsTabels += `${tabel.rate}`
			queryParamsValues += `'${rate}'`
			numberParameters++;
		}

		if (description) {
			if (numberParameters) {
				queryParamsTabels += ', '
				queryParamsValues += ', '
			}
			description = description.replace("'", '%27')
			queryParamsTabels += `${tabel.description}`
			queryParamsValues += `'${description}'`
		}

		resolve({queryParamsTabels, queryParamsValues})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Update an existing record and return the value updated
var CreateQueryUpdate = (id, name, callback) => {
	return new Promise((resolve, reject) => {
		name ? resolve(`UPDATE ${tabel.tabel} SET ${tabel.name} = '${name}' WHERE ${tabel.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Delete an existing record and return the value deleted
var CreateQueryDelete = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${tabel.tabel} WHERE ${tabel.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (id, name, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, name, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(name, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, name, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(id, (error, result) => error ? reject(error) : resolve(result) )
				break;
			default:
				reject(db.message.dataError)
				break;
		}
  	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Exports
var GetCompany = (id, name, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, name, 'get', (error, result) => {
			error ? reject(error) :	db.query(result, (error, result) => {
				if (error) reject(db.message.internalError)
				else if (!sizeOf(result)) reject(db.message.dataNotFound)
				else resolve(result)
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}		

var CreateCompany = (name, callback) => {
	return new Promise((resolve, reject) => {
        CreateQuery(undefined, name, 'create', (error, result) => {
            error ? reject(error) : db.query(result, (error, result) => {
                error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
            })
        })
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var UpdateCompany = (id, name, callback) => {
	return new Promise((resolve, reject) => {
		GetCompany(id, undefined, (error, result) => {
			error ? reject(error) :	CreateQuery(id, name, 'update', (error, result) => {
				error ? reject(error) : db.query(result, (error, result) => {
					error ? reject(db.message.internalError) : resolve({message: db.message.successfulUpdate, data: result}) 
				})
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteCompany = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetCompany(id, undefined, (error, result) => {
			error ? reject(error) :	CreateQuery(id, undefined, 'delete', (error, result) => {
				error ? reject(error) : db.query(result, (error, result) => {
					error ? reject(db.message.internalError) : resolve({message: db.message.successfulDelete, data: result}) 
				})
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

module.exports = {
  GetCompany,
  CreateCompany,
  UpdateCompany,
  DeleteCompany
}