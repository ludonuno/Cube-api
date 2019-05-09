const db = require('./../../db')
const sizeOf = require('object-sizeof')

const table = {
    table: 'my_Engine',
    id: 'id',
    name: 'name'
}

var HandleSelectData = (id, name, callback) => {
	return new Promise((resolve, reject) => {
        let search = "", numberParameters = 0
        
        if(id) {
            if (!isNaN(Number(id))) {
                search += `${table.id} = ${id}`
                numberParameters++;
            } else reject(db.message.dataError)            
        }

        if (name) {
			if (numberParameters) search += ' AND '
			search += `${tablea.name} LIKE '%${name}%'`
		}
		resolve(search)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, name, callback) => {
	return new Promise((resolve, reject) => {
		if (id || name) {
			HandleSelectData(id, name, (error, result) => {
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

var HandleInsertData = (name, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = ''

		if (name) {
			name = name.replace("'", '%27')
			fields += `${table.name}`
			values += `'${name}'`
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (name, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(name, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, name, callback) => {
	return new Promise((resolve, reject) => {
        let updateTo = ''
		
		if (isNaN(Number(id))) reject(db.message.dataError)
				
		if (name) {
			description = description.replace("'", '%27')
			updateTo += `${table.name} = '${name}'`
		}

		resolve(updateTo)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Update an existing record and return the value updated
var CreateQueryUpdate = (id, name, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, name, (error, result) => {
			error 
			? reject(error) 
			: resolve(`UPDATE ${table.table} SET ${result} WHERE ${table.id} = ${id} RETURNING *`)
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
var GetEngine = (id, name, callback) => {
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

var CreateEngine = (name, callback) => {
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

var UpdateEngine = (id, name, callback) => {
	return new Promise((resolve, reject) => {
		GetEngine(id, undefined, (error, result) => {
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

var DeleteEngine = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetEngine(id, undefined, (error, result) => {
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
  GetEngine,
  CreateEngine,
  UpdateEngine,
  DeleteEngine,
  table
}