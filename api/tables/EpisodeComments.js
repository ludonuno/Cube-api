const db = require('../../db')
const sizeOf = require('object-sizeof')

const { UserAutentication } = require('./User')

const table = {
	table: 'my_EpisodeComments',
	id: 'id',
	userId: 'userId',
	episodeId: 'episodeId',
	comment: 'comment',
	responseTo: 'responseTo'
}

var HandleSelectData = (episodeId, responseTo, callback) => {
	return new Promise((resolve, reject) => {
		if(episodeId) {
			if (!isNaN(Number(episodeId))) {
				resolve(`${table.episodeId} = ${episodeId} AND ${table.responseTo} IS NULL`)
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

var CreateQuerySelect = (episodeId, responseTo, callback) => {
	return new Promise((resolve, reject) => {
		HandleSelectData(episodeId, responseTo, (error, result) => {
			error ? reject(error) : resolve(`SELECT * FROM ${table.table} WHERE ${result}`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (userId, episodeId, comment, responseTo, callback) => {
	return new Promise((resolve, reject) => {
		let fields = '', values = '', numberParameters = 0
		if (userId) {
			if (!isNaN(Number(userId))) {
				fields += `${table.userId}`
				values += `${userId}`
				numberParameters++
			} else reject(db.message.dataError)
		}

		if (episodeId) {
			if (!isNaN(Number(episodeId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.episodeId}`
				values += `${episodeId}`
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
var CreateQueryInsert = (userId, episodeId, comment, responseTo, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(userId, episodeId, comment, responseTo, (error, result) => {
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

var CreateQuery = (id, userId, episodeId, comment, responseTo, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(episodeId, responseTo, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				CreateQueryInsert(userId, episodeId, comment, responseTo, (error, result) => error ? reject(error) : resolve(result) )
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
var GetEpisodeComments = (episodeId, responseTo, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(undefined, undefined, episodeId, undefined, responseTo, 'get', (error, result) => {
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

var CreateEpisodeComments = (userEmail, userPassword, userId, episodeId, comment, responseTo, callback) => {
	return new Promise((resolve, reject) => {
		UserAutentication(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result[0].id == userId) {
				CreateQuery(undefined, userId, episodeId, comment, responseTo, 'create', (error, result) => {
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

var DeleteEpisodeComments = (userEmail, userPassword, userId, id, callback) => {
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
  GetEpisodeComments,
  CreateEpisodeComments,
  DeleteEpisodeComments,
  table
}