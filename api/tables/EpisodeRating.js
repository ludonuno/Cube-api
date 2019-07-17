const db = require('../../db')
const sizeOf = require('object-sizeof')

const seasonTable = require('./Season').table
const episodeTable = require('./Episode').table

const { UserAutentication } = require('./User')

const table = {
    table: 'my_EpisodeRating',
    userId: 'userId',
	episodeId: 'episodeId',
	rate: 'rate'
}

var HandleSelectData = (seriesId, seasonId, episodeId, callback) => {
	return new Promise((resolve, reject) => {
		// só irá receber 1 deles
		if(seriesId) {
            if (!isNaN(Number(seriesId))) {
				resolve(`INNER JOIN ${episodeTable.table} ON ${episodeTable.table}.${episodeTable.id} = ${table.episodeId} INNER JOIN ${seasonTable.table} ON ${seasonTable.table}.${seasonTable.id} = ${episodeTable.table}.${episodeTable.seasonId} WHERE ${seasonTable.table}.${seasonTable.seriesId} = ${seriesId}`)
            } else reject(db.message.dataError)            
		}

		if(seasonId) {
            if (!isNaN(Number(seasonId))) {
				resolve(`INNER JOIN ${episodeTable.table} ON ${episodeTable.table}.${episodeTable.id} = ${table.episodeId} WHERE ${episodeTable.table}.${episodeTable.seasonId} = ${seasonId}`)
            } else reject(db.message.dataError)            
		}

		if(episodeId) {
            if (!isNaN(Number(episodeId))) {
				resolve(`WHERE ${table.episodeId} = ${episodeId}`)
            } else reject(db.message.dataError)            
		}
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (userId, seriesId, seasonId, episodeId, callback) => {
	return new Promise((resolve, reject) => {
		if(userId) {
			resolve(`SELECT * FROM ${table.table} WHERE ${table.userId} = ${userId} AND ${table.episodeId} = ${episodeId}`)
		} else {
			HandleSelectData(seriesId, seasonId, episodeId, (error, result) => {
				error ? reject(error) : resolve(`SELECT AVG(${table.table}.${table.rate}), COUNT(${table.rate}) FROM ${table.table} ${result}`)
			})
		}
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (userId, episodeId, rate, callback) => {
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
var CreateQueryInsert = (userId, episodeId, rate, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(userId, episodeId, rate, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (userId, episodeId, rate, callback) => {
	return new Promise((resolve, reject) => {
		if (isNaN(Number(userId)) || isNaN(Number(episodeId))) reject(db.message.dataError)
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
var CreateQueryUpdate = (userId, episodeId, rate, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(userId, episodeId, rate, (error, result) => {
			error 
			? reject(error) 
			: resolve(`UPDATE ${table.table} SET ${result} WHERE ${table.userId} = ${userId} AND ${table.episodeId} = ${episodeId} RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (userId, seriesId, seasonId, episodeId, rate, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(userId, seriesId, seasonId, episodeId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(userId, episodeId, rate, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(userId, episodeId, rate, (error, result) => error ? reject(error) : resolve(result) )
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
var GetEpisodeRating = (seriesId, seasonId, episodeId, userId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(userId, seriesId, seasonId, episodeId, undefined, 'get', (error, result) => {
			error ? reject(error) :	db.query(result, (error, result) => {
				console.log(result)
				if (error) reject(db.message.internalError)
				else if (result && !Number(result[0].count)) reject(db.message.dataNotFound)
				else resolve(result)
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}		

var CreateEpisodeRating = (userEmail, userPassword, userId, episodeId, rate, callback) => {
	return new Promise((resolve, reject) => {
		UserAutentication(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result[0].id == userId) {
				GetEpisodeRating(undefined, undefined, episodeId, userId, (error, result) => {
					if(error == db.message.dataNotFound) {
						CreateQuery(userId, undefined, undefined, episodeId, rate, 'create', (error, result) => {
							error ? reject(error) : db.query(result, (error, result) => {
								error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
							})
						})
					} else if(result) {
						CreateQuery(userId, undefined, undefined, episodeId, rate, 'update', (error, result) => {
							error ? reject(error) : db.query(result, (error, result) => {
								error ? reject(db.message.internalError) : resolve({message: db.message.successfulUpdate, data: result}) 
							})
						})
					}
					else reject(error)
				})
			} else reject('Não tem permissões')
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

module.exports = {
  GetEpisodeRating,
  CreateEpisodeRating,
  table
}