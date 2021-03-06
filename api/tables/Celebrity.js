const db = require('../../db')
const sizeOf = require('object-sizeof')

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_celebrity',
    id: 'id',
	name: 'name',
	birthday: 'birthday',
	biography: 'biography'
}

var HandleSelectData = (id, name, birthday, callback) => {
	return new Promise((resolve, reject) => {
		let searchFor = "", numberParameters = 0
		
        if(id) {
            if (!isNaN(Number(id))) {
				searchFor += `${table.id} = ${id}`
				numberParameters++
            } else reject(db.message.dataError)            
		}
		
        if (name) {
			if (numberParameters) searchFor += ' AND '
			name = name.replace( new RegExp("'", 'g') , '%27')
			searchFor += `${table.name} LIKE '%${name}%'`
			numberParameters++
		}

		if (birthday) {
			if (numberParameters) searchFor += ' AND '
			birthday = birthday.replace( new RegExp("'", 'g') , '%27')
			searchFor += `${table.birthday} = '${birthday}'`
		}

		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, name, birthday, callback) => {
	return new Promise((resolve, reject) => {
		if (id || name || birthday) {
			HandleSelectData(id, name, birthday, (error, result) => {
				error ? reject(error) : resolve(`SELECT * FROM ${table.table} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${table.table}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (name, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (name) {
			name = name.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.name}`
			values += `'${name}'`
			numberParameters++;
		}

		if (birthday) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			birthday = birthday.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.birthday}`
			values += `'${birthday}'`
			numberParameters++
		}

		if (biography) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			biography = biography.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.biography}`
			values += `'${biography}'`
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (name, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(name, birthday, biography, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, name, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
        let updateTo = '', numberParameters = 0
		
		if (isNaN(Number(id))) reject(db.message.dataError)
		
		if (name) {
			name = name.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.name} = '${name}'`
			numberParameters++;
		}

		if (birthday) {
			if (numberParameters) updateTo += ', '
			birthday = birthday.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.birthday} = '${birthday}'`
			numberParameters++
		}

		if (biography) {
			if (numberParameters) updateTo += ', '
			biography = biography.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.biography} = '${biography}'`
		}

		resolve(updateTo)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Update an existing record and return the value updated
var CreateQueryUpdate = (id, name, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, name, birthday, biography, (error, result) => {
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

var CreateQuery = (id, name, birthday, biography, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, name, birthday, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(name, birthday, biography, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, name, birthday, biography, (error, result) => error ? reject(error) : resolve(result) )
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
var GetCelebrity = (id, name, birthday, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, name, undefined, birthday, 'get', (error, result) => {
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

var CreateCelebrity = (userEmail, userPassword, name, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {		
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(undefined, name, birthday, biography, 'create', (error, result) => {
					error ? reject(error) : db.query(result, (error, result) => {
						error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
					})
				})
			} else reject('Não tem permissões')
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var UpdateCelebrity = (userEmail, userPassword, id, name, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, name, birthday, biography, 'update', (error, result) => {
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

var DeleteCelebrity = (userEmail, userPassword, id, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, undefined, undefined, undefined, 'delete', (error, result) => {
					error ? reject(error) : db.query(result, (error, result) => {
						error ? reject(db.message.internalError) : resolve({message: db.message.successfulDelete, data: result}) 
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
  GetCelebrity,
  CreateCelebrity,
  UpdateCelebrity,
  DeleteCelebrity,
  table
}