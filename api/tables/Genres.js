const db = require('./../../db')
const sizeOf = require('object-sizeof')

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_Genres',
    id: 'id',
    genre: 'genre'
}

var HandleSelectData = (id, genre, callback) => {
	return new Promise((resolve, reject) => {
        let searchFor = "", numberParameters = 0
        
        if(id) {
            if (!isNaN(Number(id))) {
                searchFor += `${table.id} = ${id}`
                numberParameters++;
            } else reject(db.message.dataError)            
        }

        if (genre) {
			if (numberParameters) searchFor += ' AND '
			genre = genre.replace( new RegExp("'", 'g') , '%27')
			searchFor += `${table.genre} = '${genre}'`
		}
		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, genre, callback) => {
	return new Promise((resolve, reject) => {
		if (id || genre) {
			HandleSelectData(id, genre, (error, result) => {
				error ? reject(error) : resolve(`SELECT * FROM ${table.table} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${table.table}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (genre, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = ''

		if (genre) {
			genre = genre.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.genre}`
			values += `'${genre}'`
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (genre, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(genre, (error, result) => {
			error ? reject(error) : resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
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

var CreateQuery = (id, genre, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, genre, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(genre, (error, result) => error ? reject(error) : resolve(result) )
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
var GetGenres = (id, genre, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, genre, 'get', (error, result) => {
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

var CreateGenres = (userEmail, userPassword, genre, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				GetGenres(undefined, genre, (error, result) => {
					if(error == db.message.dataNotFound) {
						CreateQuery(undefined, genre, 'create', (error, result) => {
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

var DeleteGenres = (userEmail, userPassword, id, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, undefined, 'delete', (error, result) => {
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
  GetGenres,
  CreateGenres,
  DeleteGenres,
  table
}