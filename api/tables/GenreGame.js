const db = require('./../../db')
const sizeOf = require('object-sizeof')

const gameTable = require('./Game').table
const genresTable = require('./Genres').table

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_GenreGame',
    gameId: 'gameId',
    genreId: 'genreId'
}

var HandleSelectData = (gameId, genreId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(gameId) {
            if (!isNaN(Number(gameId))) {
				fields = `${genresTable.table}.${genresTable.id}, ${genresTable.table}.${genresTable.genre}`
				searchFor += `${table.gameId} = ${gameId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(genreId) {
            if (!isNaN(Number(genreId))) {
				fields = `${gameTable.table}.${gameTable.id}, ${gameTable.table}.${gameTable.title}, ${gameTable.table}.${gameTable.releaseDate}, ${gameTable.table}.${gameTable.synopsis}, ${gameTable.table}.${gameTable.engineId}, ${gameTable.table}.${gameTable.parentAdvisoryId}, ${gameTable.table}.${gameTable.publicadorId}, ${gameTable.table}.${gameTable.sagaId}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.genreId} = ${genreId}`
            } else reject(db.message.dataError)            
		}
		resolve({fields, searchFor})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (gameId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		if (gameId || genreId) {
			HandleSelectData(gameId, genreId, (error, result) => {
				error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${gameTable.table} ON ${gameTable.table}.${gameTable.id} = ${table.gameId} INNER JOIN ${genresTable.table} ON ${genresTable.table}.${genresTable.id} = ${table.genreId}  WHERE ${result.searchFor} ORDER BY (${table.gameId}, ${table.genreId})`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${gameTable.table} ON ${gameTable.table}.${gameTable.id} = ${table.gameId} INNER JOIN ${genresTable.table} ON ${genresTable.table}.${genresTable.id} = ${table.genreId} ORDER BY (${table.gameId}, ${table.genreId})`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (gameId, genreId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (gameId) {
			if (!isNaN(Number(gameId))) {
				fields += `${table.gameId}`
				values += `${gameId}`
				numberParameters++
			} else reject(db.message.dataError)
		}

		if (genreId) {
			if (!isNaN(Number(genreId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.genreId}`
				values += `${genreId}`
			} else reject(db.message.dataError)
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (gameId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(gameId, genreId, (error, result) => {
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
var CreateQueryDelete = (gameId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		(!isNaN(Number(gameId)) && !isNaN(Number(genreId)))
		? resolve(`DELETE FROM ${table.table} WHERE ${table.gameId} = ${gameId} AND ${table.genreId} = ${genreId} RETURNING *`) 
		: reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (gameId, genreId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(gameId, genreId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(gameId, genreId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(gameId, genreId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetGenreGame = (gameId, genreId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(gameId, genreId, 'get', (error, result) => {
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

var CreateGenreGame = (userEmail, userPassword, gameId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		GetGenreGame(gameId, genreId, (error, result) => {
			if(error == db.message.dataNotFound) {
				CanUserEdit(userEmail, userPassword, (error, result) => {
					if (error) reject(error)
					else if(result) {
						CreateQuery(gameId, genreId, 'create', (error, result) => {
							error ? reject(error) : db.query(result, (error, result) => {
								error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
							})
						})
					} else reject('Não tem permissões')
				})
			} else if(result) reject(db.message.dataFound)
			else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteGenreGame = (userEmail, userPassword, gameId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(gameId, genreId, 'delete', (error, result) => {
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
  GetGenreGame,
  CreateGenreGame,
  DeleteGenreGame,
  table
}