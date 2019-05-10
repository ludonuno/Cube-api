const db = require('./../../db')
const sizeOf = require('object-sizeof')

const celebrityTable = require('./Celebrity').table
const assignmentTable = require('./Assignment').table
const gameTable = require('./Game').table

const table = {
    table: 'my_CelebrityAssignmentGame',
	celebrityId : 'celebrityId',
	assignmentId : 'assignmentId',
	gameId : 'gameId'
}

//TODO: alterar as genresTable e bookTable para celebrityTable e assignmentTable
//TODO: adicionar a tabela gameTable nas queries

var HandleSelectData = (celebrityId, assignmentId, gameId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(celebrityId) {
            if (!isNaN(Number(celebrityId))) {
				fields = `${genresTable.table}.${genresTable.id}, ${genresTable.table}.${genresTable.genre}`
				searchFor += `${table.celebrityId} = ${celebrityId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(assignmentId) {
            if (!isNaN(Number(assignmentId))) {
				fields = `${bookTable.table}.${bookTable.id}, ${bookTable.table}.${bookTable.title}, ${bookTable.table}.${bookTable.photo}, ${bookTable.table}.${bookTable.releaseDate}, ${bookTable.table}.${bookTable.synopsis}, ${bookTable.table}.${bookTable.publishingCompanyId}, ${bookTable.table}.${bookTable.sagaId}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.assignmentId} = ${assignmentId}`
            } else reject(db.message.dataError)            
		}

		if(gameId) {
            if (!isNaN(Number(gameId))) {
				fields = `${bookTable.table}.${bookTable.id}, ${bookTable.table}.${bookTable.title}, ${bookTable.table}.${bookTable.photo}, ${bookTable.table}.${bookTable.releaseDate}, ${bookTable.table}.${bookTable.synopsis}, ${bookTable.table}.${bookTable.publishingCompanyId}, ${bookTable.table}.${bookTable.sagaId}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.gameId} = ${gameId}`
            } else reject(db.message.dataError)            
		}

		resolve({fields, searchFor})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (celebrityId, assignmentId, gameId, callback) => {
	return new Promise((resolve, reject) => {
		if (celebrityId || assignmentId || gameId) {
			HandleSelectData(celebrityId, assignmentId, gameId, (error, result) => {
				error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${bookTable.table} ON ${bookTable.table}.${bookTable.id} = ${table.celebrityId} INNER JOIN ${genresTable.table} ON ${genresTable.table}.${genresTable.id} = ${table.assignmentId, gameId}  WHERE ${result.searchFor} ORDER BY (${table.celebrityId}, ${table.assignmentId, gameId})`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${bookTable.table} ON ${bookTable.table}.${bookTable.id} = ${table.celebrityId} INNER JOIN ${genresTable.table} ON ${genresTable.table}.${genresTable.id} = ${table.assignmentId, gameId} ORDER BY (${table.celebrityId}, ${table.assignmentId, gameId})`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (celebrityId, assignmentId, gameId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (celebrityId) {
			if (!isNaN(Number(celebrityId))) {
				fields += `${table.celebrityId}`
				values += `${celebrityId}`
				numberParameters++
			}
		}

		if (assignmentId) {
			if (!isNaN(Number(assignmentId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.assignmentId}`
				values += `${assignmentId}`
			}
		}

		if (gameId) {
			if (!isNaN(Number(gameId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.gameId}`
				values += `${gameId}`
			}
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (celebrityId, assignmentId, gameId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(celebrityId, assignmentId, gameId, (error, result) => {
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
var CreateQueryDelete = (celebrityId, assignmentId, gameId, callback) => {
	return new Promise((resolve, reject) => {
		(!isNaN(Number(celebrityId)) && !isNaN(Number(assignmentId)) && !isNaN(Number(gameId)) )
		? resolve(`DELETE FROM ${table.table} WHERE ${table.celebrityId} = ${celebrityId} AND ${table.assignmentId} = ${assignmentId} AND ${table.gameId} = ${gameId} RETURNING *`) 
		: reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (celebrityId, assignmentId, gameId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(celebrityId, assignmentId, gameId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(celebrityId, assignmentId, gameId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(celebrityId, assignmentId, gameId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetCelebrityAssignmentGame = (celebrityId, assignmentId, gameId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(celebrityId, assignmentId, gameId, 'get', (error, result) => {
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

var CreateCelebrityAssignmentGame = (celebrityId, assignmentId, gameId, callback) => {
	return new Promise((resolve, reject) => {
        CreateQuery(celebrityId, assignmentId, gameId, 'create', (error, result) => {
            error ? reject(error) : db.query(result, (error, result) => {
                error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
            })
        })
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteCelebrityAssignmentGame = (celebrityId, assignmentId, gameId, callback) => {
	return new Promise((resolve, reject) => {
		GetCelebrityAssignmentGame(celebrityId, assignmentId, gameId, (error, result) => {
			error ? reject(error) :	CreateQuery(celebrityId, assignmentId, gameId, 'delete', (error, result) => {
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
  GetCelebrityAssignmentGame,
  CreateCelebrityAssignmentGame,
  DeleteCelebrityAssignmentGame,
  table
}