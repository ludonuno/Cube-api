const db = require('../../db')
const sizeOf = require('object-sizeof')

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_Assignment',
    id: 'id',
	assignment: 'assignment',
	description: 'description'
}

var HandleSelectData = (id, assignment, callback) => {
	return new Promise((resolve, reject) => {
        let searchFor = "", numberParameters = 0
        
        if(id) {
            if (!isNaN(Number(id))) {
				searchFor += `${table.id} = ${id}`
				numberParameters++
            } else reject(db.message.dataError)            
		}
		
		if(assignment) {
			if(numberParameters) searchFor+= ' AND '
			assignment = assignment.replace( new RegExp("'", 'g') , '%27')
			searchFor += `${table.assignment} = '${assignment}'`
		}

		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, assignment, callback) => {
	return new Promise((resolve, reject) => {
		if (id || assignment) {
			HandleSelectData(id, assignment, (error, result) => {
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

var HandleInsertData = (assignment, description, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (assignment) {
			assignment = assignment.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.assignment}`
			values += `'${assignment}'`
			numberParameters++;
		}

		if (description) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			description = description.replace( new RegExp("'", 'g') , '%27')
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
var CreateQueryInsert = (assignment, description, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(assignment, description, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, assignment, description, callback) => {
	return new Promise((resolve, reject) => {
        let updateTo = '', numberParameters = 0
		
		if (isNaN(Number(id))) reject(db.message.dataError)
		
		if (assignment) {
			assignment = assignment.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.assignment} = ${assignment}`
			numberParameters++;
		}

		if (description) {
			if (numberParameters) updateTo += ', '
			description = description.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.description} = '${description}'`
		}

		resolve(updateTo)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Update an existing record and return the value updated
var CreateQueryUpdate = (id, assignment, description, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, assignment, description, (error, result) => {
			error 
			? reject(db.message.dataError) 
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

var CreateQuery = (id, assignment, description, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, assignment, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(assignment, description, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, assignment, description, (error, result) => error ? reject(error) : resolve(result) )
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
var GetAssignment = (id, assignment,  callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, assignment, undefined, 'get', (error, result) => {
			console.log(error, result)
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

var CreateAssignment = (userEmail, userPassword, assignment, description, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				GetAssignment(undefined, assignment, (error, result) => {
					if(error == db.message.dataNotFound) {
						CreateQuery(undefined, assignment, description, 'create', (error, result) => {
							console.log(error, result)
							error ? reject(error) : db.query(result, (error, result) => {
								error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
							})
						})
					} else if(result) reject(db.message.dataFound)
					else reject(error)
				})
			} else reject('Não tem permissões')
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var UpdateAssignment = (userEmail, userPassword, id, assignment, description, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, assignment, description, 'update', (error, result) => {
					console.log(error, result)
					error ? reject(error) : db.query(result, (error, result) => {
						error ? reject(db.message.internalError) : resolve({message: db.message.successfulUpdate, data: result}) 
					})
				})
			} else reject('Não tem permissões')
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteAssignment = (userEmail, userPassword, id, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				GetAssignment(id, (error, result) => {
					error ? reject(error) :	CreateQuery(id, undefined, undefined, 'delete', (error, result) => {
						console.log(error, result)
						error ? reject(error) : db.query(result, (error, result) => {
							error ? reject(db.message.internalError) : resolve({message: db.message.successfulDelete, data: result}) 
						})
					})
				})
			} else reject('Não tem permissões')
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

module.exports = {
  GetAssignment,
  CreateAssignment,
  UpdateAssignment,
  DeleteAssignment,
  table
}