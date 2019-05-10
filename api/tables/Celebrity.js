const db = require('../../db')
const sizeOf = require('object-sizeof')

const table = {
    table: 'my_Celebrity',
    id: 'id',
	name: 'name',
	photo: 'photo',
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
			searchFor += `${table.name} LIKE '%${name}%'`
		}

		if (birthday) {
			if (numberParameters) searchFor += ' AND '
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

var HandleInsertData = (name, photo, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (name) {
			name = name.replace("'", '%27')
			fields += `${table.name}`
			values += `'${name}'`
			numberParameters++;
		}

		if (photo) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			fields += `${table.description}`
			values += `decode('${photo}', 'hex')`
		}

		if (birthday) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			fields += `${table.birthday}`
			values += `'${birthday}'`
		}

		if (biography) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			biography = biography.replace("'", '%27')
			fields += `${table.description}`
			values += `'${biography}'`
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (name, photo, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(name, photo, birthday, biography, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, name, photo, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
        let updateTo = '', numberParameters = 0
		
		if (isNaN(Number(id))) reject(db.message.dataError)
		
		if (name) {
			name = name.replace("'", '%27')
			updateTo += `${table.name} = '${name}'`
			numberParameters++;
		}

		if (photo) {
			if (numberParameters) updateTo += ' AND '
			updateTo += `${table.description} = decode('${photo}', 'hex')`
			numberParameters++
		}

		if (birthday) {
			if (numberParameters) updateTo += ' AND '
			updateTo += `${table.birthday} = '${birthday}'`
			numberParameters++
		}

		if (biography) {
			if (numberParameters) updateTo += ' AND '
			biography = biography.replace("'", '%27')
			updateTo += `${table.description} = '${biography}'`
			numberParameters++
		}

		resolve(updateTo)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Update an existing record and return the value updated
var CreateQueryUpdate = (id, name, photo, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, name, photo, birthday, biography, (error, result) => {
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

var CreateQuery = (id, name, photo, birthday, biography, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, name, birthday, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(name, photo, birthday, biography, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, name, photo, birthday, biography, (error, result) => error ? reject(error) : resolve(result) )
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
		CreateQuery(id, name, undefined, birthday, undefined, 'get', (error, result) => {
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

var CreateCelebrity = (name, photo, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
        CreateQuery(undefined, name, photo, birthday, biography, 'create', (error, result) => {
            error ? reject(error) : db.query(result, (error, result) => {
                error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
            })
        })
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var UpdateCelebrity = (id, name, photo, birthday, biography, callback) => {
	return new Promise((resolve, reject) => {
		GetCelebrity(id, undefined, undefined, (error, result) => {
			error ? reject(error) :	CreateQuery(id, name, photo, birthday, biography, 'update', (error, result) => {
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

var DeleteCelebrity = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetCelebrity(id, undefined, undefined, (error, result) => {
			error ? reject(error) :	CreateQuery(id, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
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
  GetCelebrity,
  CreateCelebrity,
  UpdateCelebrity,
  DeleteCelebrity,
  table
}