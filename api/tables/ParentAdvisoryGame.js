const db = require('../../db')
const sizeOf = require('object-sizeof')

const table = {
    table: 'my_ParentAdvisoryGame',
    id: 'id',
	rate: 'rate',
	description: 'description'
}

var HandleSelectData = (id, callback) => {
	return new Promise((resolve, reject) => {
        let searchFor = ""
        
        if(id) {
            if (!isNaN(Number(id))) {
                searchFor += `${table.id} = ${id}`
            } else reject(db.message.dataError)            
        }
		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, callback) => {
	return new Promise((resolve, reject) => {
		if (id) {
			HandleSelectData(id, (error, result) => {
				error 
				? reject(error) 
				: resolve(`SELECT * FROM ${table.table} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${table.table}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (rate, description, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (rate) {
			rate = rate.replace("'", '%27')
			fields += `${table.rate}`
			values += `'${rate}'`
			numberParameters++;
		}

		if (description) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			description = description.replace("'", '%27')
			fields += `${table.description}`
			values += `'${description}'`
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (rate, description, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(rate, description, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, rate, description, callback) => {
	return new Promise((resolve, reject) => {
        let updateTo = '', numberParameters = 0
		
		if (isNaN(Number(id))) reject(db.message.dataError)
		
		if (rate) {
			updateTo += `${table.rate} = ${rate}`
			numberParameters++;
		}

		if (description) {
			if (numberParameters) updateTo += ' AND '
			description = description.replace("'", '%27')
			updateTo += `${table.description} = '${description}'`
		}

		resolve(updateTo)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Update an existing record and return the value updated
var CreateQueryUpdate = (id, rate, description, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, rate, description, (error, result) => {
			error 
			? reject(db.message.dataError) 
			: resolve(`UPDATE ${table.table} SET ${result}' WHERE ${table.id} = ${id} RETURNING *`)
		})
		
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Delete an existing record and return the value deleted
var CreateQueryDelete = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${table.table} WHERE ${table.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (id, rate, description, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(rate, description, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, rate, description, (error, result) => error ? reject(error) : resolve(result) )
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
var GetParentAdvisoryGame = (id,  callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, undefined, undefined, 'get', (error, result) => {
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

var CreateParentAdvisoryGame = (rate, description, callback) => {
	return new Promise((resolve, reject) => {
        CreateQuery(undefined, rate, description, 'create', (error, result) => {
            error ? reject(error) : db.query(result, (error, result) => {
                error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
            })
        })
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var UpdateParentAdvisoryGame = (id, rate, description, callback) => {
	return new Promise((resolve, reject) => {
		GetParentAdvisoryGame(id, (error, result) => {
			error ? reject(error) :	CreateQuery(id, rate, description, 'update', (error, result) => {
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

var DeleteParentAdvisoryGame = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetParentAdvisoryGame(id, (error, result) => {
			error ? reject(error) :	CreateQuery(id, undefined, undefined, 'delete', (error, result) => {
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
  GetParentAdvisoryGame,
  CreateParentAdvisoryGame,
  UpdateParentAdvisoryGame,
  DeleteParentAdvisoryGame,
  table
}