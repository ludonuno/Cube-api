const db = require('../../db')
const sizeOf = require('object-sizeof')

const { UserAutentication } = require('./User')

const table = {
    table: 'my_GameRating',
    userId: 'userId',
	gameId: 'gameId',
	rate: 'rate'
}

var HandleSelectData = (gameId, callback) => {
	return new Promise((resolve, reject) => {
		if(gameId) {
            if (!isNaN(Number(gameId))) {
				resolve(`${table.gameId} = ${gameId}`)
            } else reject(db.message.dataError)            
		}
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (gameId, callback) => {
	return new Promise((resolve, reject) => {
		HandleSelectData(gameId, (error, result) => {
			error ? reject(error) : resolve(`SELECT AVG(${table.rate}), COUNT(${table.rate}) FROM ${table.table} WHERE ${result}`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (userId, gameId, rate, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0
		if (userId) {
			if (!isNaN(Number(userId))) {
				fields += `${table.userId}`
				values += `${userId}`
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
				numberParameters++
			} else reject(db.message.dataError)
		}
		if (rate) {
			if (!isNaN(Number(rate))) {
				if (rate < 0 || rate > 10) reject(db.message.dataError)
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.rate}`
				values += `${rate}`
			} else reject(db.message.dataError)
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (userId, gameId, rate, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(userId, gameId, rate, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (userId, gameId, rate, callback) => {
	return new Promise((resolve, reject) => {
		if (isNaN(Number(userId)) || isNaN(Number(gameId))) reject(db.message.dataError)
		if (!isNaN(Number(rate))) {
			if (rate < 0 || rate > 10) reject(db.message.dataError)
			else resolve(`${table.rate} = ${rate}`)
		}
		else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Update an existing record and return the value updated
var CreateQueryUpdate = (userId, gameId, rate, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(userId, gameId, rate, (error, result) => {
			error 
			? reject(error) 
			: resolve(`UPDATE ${table.table} SET ${result} WHERE ${table.userId} = ${userId} AND ${table.gameId} = ${gameId} RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (userId, gameId, rate, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(gameId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(userId, gameId, rate, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(userId, gameId, rate, (error, result) => error ? reject(error) : resolve(result) )
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
var GetGameRating = (gameId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(undefined, gameId, undefined, 'get', (error, result) => {
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

var CreateGameRating = (userEmail, userPassword, userId, gameId, rate, callback) => {
	return new Promise((resolve, reject) => {
		UserAutentication(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result[0].id == userId) {
				CreateQuery(userId, gameId, rate, 'create', (error, result) => {
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

var UpdateGameRating = (userEmail, userPassword, userId, gameId, rate, callback) => {
	return new Promise((resolve, reject) => {
		UserAutentication(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result[0].id == userId) {
				CreateQuery(userId, gameId, rate, 'update', (error, result) => {
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
  GetGameRating,
  CreateGameRating,
  UpdateGameRating,
  table
}