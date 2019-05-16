const db = require('../../db')
const sizeOf = require('object-sizeof')

const { UserAutentication } = require('./User')

const table = {
	table: 'my_MovieComments',
	id: 'id',
	userId: 'userId',
	movieId: 'movieId',
	comment: 'comment',
	responseTo: 'responseTo'
}

var HandleSelectData = (movieId, responseTo, callback) => {
	return new Promise((resolve, reject) => {
		if(movieId) {
			if (!isNaN(Number(movieId))) {
				resolve(`${table.movieId} = ${movieId} AND ${table.responseTo} IS NULL`)
			} else reject(db.message.dataError)            
		}
		if(responseTo) {
			if (!isNaN(Number(responseTo))) {
				resolve(`${table.responseTo} = ${responseTo}`)
			} else reject(db.message.dataError)            
		}
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (movieId, responseTo, callback) => {
	return new Promise((resolve, reject) => {
		HandleSelectData(movieId, responseTo, (error, result) => {
			error ? reject(error) : resolve(`SELECT * FROM ${table.table} WHERE ${result}`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (userId, movieId, comment, responseTo, callback) => {
	return new Promise((resolve, reject) => {
		let fields = '', values = '', numberParameters = 0
		if (userId) {
			if (!isNaN(Number(userId))) {
				fields += `${table.userId}`
				values += `${userId}`
				numberParameters++
			} else reject(db.message.dataError)
		}

		if (movieId) {
			if (!isNaN(Number(movieId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.movieId}`
				values += `${movieId}`
				numberParameters++
			} else reject(db.message.dataError)
		}

		if (comment) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			comment = comment.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.comment}`
			values += `'${comment}'`
			numberParameters++
		}

		if (responseTo) {
			if (!isNaN(Number(responseTo))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.responseTo}`
				values += `${responseTo}`
			} else reject(db.message.dataError)
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (userId, movieId, comment, responseTo, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(userId, movieId, comment, responseTo, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
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

var CreateQuery = (id, userId, movieId, comment, responseTo, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(movieId, responseTo, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				CreateQueryInsert(userId, movieId, comment, responseTo, (error, result) => error ? reject(error) : resolve(result) )
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
var GetMovieComments = (movieId, responseTo, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(undefined, undefined, movieId, undefined, responseTo, 'get', (error, result) => {
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

var CreateMovieComments = (userEmail, userPassword, userId, movieId, comment, responseTo, callback) => {
	return new Promise((resolve, reject) => {
		UserAutentication(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result[0].id == userId) {
				CreateQuery(undefined, userId, movieId, comment, responseTo, 'create', (error, result) => {
					console.log(error, result)
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

var DeleteMovieComments = (userEmail, userPassword, userId, id, callback) => {
	return new Promise((resolve, reject) => {
		UserAutentication(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result[0].id == userId) {
				CreateQuery(id, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
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

module.exports = {
  GetMovieComments,
  CreateMovieComments,
  DeleteMovieComments,
  table
}