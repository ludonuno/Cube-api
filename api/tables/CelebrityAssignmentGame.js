const db = require('./../../db')
const sizeOf = require('object-sizeof')

const celebrityTable = require('./Celebrity').table
const assignmentTable = require('./Assignment').table
const gameTable = require('./Game').table

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_CelebrityAssignmentGame',
	celebrityId : 'celebrityId',
	assignmentId : 'assignmentId',
	gameId : 'gameId'
}

var HandleSelectData = (celebrityId, assignmentId, gameId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(celebrityId) {
            if (!isNaN(Number(celebrityId))) {
				fields = `${assignmentTable.table}.${assignmentTable.id}, ${assignmentTable.table}.${assignmentTable.description}, ${gameTable.table}.${gameTable.id}, ${gameTable.table}.${gameTable.title}, ${gameTable.table}.${gameTable.releaseDate}, ${gameTable.table}.${gameTable.synopsis}, ${gameTable.table}.${gameTable.engineId}, ${gameTable.table}.${gameTable.parentAdvisoryId}, ${gameTable.table}.${gameTable.publicadorId}, ${gameTable.table}.${gameTable.sagaId}`
				searchFor += `${table.celebrityId} = ${celebrityId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(assignmentId) {
            if (!isNaN(Number(assignmentId))) {
				fields = `${celebrityTable.table}.${celebrityTable.id}, ${celebrityTable.table}.${celebrityTable.name}, ${celebrityTable.table}.${celebrityTable.birthday}, ${celebrityTable.table}.${celebrityTable.biography}, ${gameTable.table}.${gameTable.id}, ${gameTable.table}.${gameTable.title}, ${gameTable.table}.${gameTable.releaseDate}, ${gameTable.table}.${gameTable.synopsis}, ${gameTable.table}.${gameTable.engineId}, ${gameTable.table}.${gameTable.parentAdvisoryId}, ${gameTable.table}.${gameTable.publicadorId}, ${gameTable.table}.${gameTable.sagaId}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.assignmentId} = ${assignmentId}`
				numberParameters++
            } else reject(db.message.dataError)            
		}

		if(gameId) {
            if (!isNaN(Number(gameId))) {
				fields = `${celebrityTable.table}.${celebrityTable.id}, ${celebrityTable.table}.${celebrityTable.name}, ${celebrityTable.table}.${celebrityTable.birthday}, ${celebrityTable.table}.${celebrityTable.biography}, ${assignmentTable.table}.${assignmentTable.id}, ${assignmentTable.table}.${assignmentTable.description}`
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
				error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId} INNER JOIN ${assignmentTable.table} ON ${assignmentTable.table}.${assignmentTable.id} = ${table.assignmentId} INNER JOIN ${gameTable.table} ON ${gameTable.table}.${gameTable.id} = ${table.gameId} WHERE ${result.searchFor} ORDER BY (${table.celebrityId}, ${table.assignmentId}, ${table.gameId})`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId} INNER JOIN ${assignmentTable.table} ON ${assignmentTable.table}.${assignmentTable.id} = ${table.assignmentId} INNER JOIN ${gameTable.table} ON ${gameTable.table}.${gameTable.id} = ${table.gameId} ORDER BY (${table.celebrityId}, ${table.assignmentId})`)
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
			} else reject(db.message.dataError)
		}

		if (assignmentId) {
			if (!isNaN(Number(assignmentId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.assignmentId}`
				values += `${assignmentId}`
				numberParameters++
			} else reject(db.message.dataError)
		}

		if (gameId) {
			if (!isNaN(Number(gameId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.gameId}`
				values += `${gameId}`
			} else reject(db.message.dataError)
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

var CreateCelebrityAssignmentGame = (userEmail, userPassword, celebrityId, assignmentId, gameId, callback) => {
	return new Promise((resolve, reject) => {
		GetCelebrityAssignmentGame(celebrityId, assignmentId, gameId, (error, result) => {
			if(error == db.message.dataNotFound) {
				CanUserEdit(userEmail, userPassword, (error, result) => {
					if (error) reject(error)
					else if(result) {
						CreateQuery(celebrityId, assignmentId, gameId, 'create', (error, result) => {
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

var DeleteCelebrityAssignmentGame = (userEmail, userPassword, celebrityId, assignmentId, gameId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(celebrityId, assignmentId, gameId, 'delete', (error, result) => {
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
  GetCelebrityAssignmentGame,
  CreateCelebrityAssignmentGame,
  DeleteCelebrityAssignmentGame,
  table
}