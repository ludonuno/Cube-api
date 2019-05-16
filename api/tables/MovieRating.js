const db = require('../../db')
const sizeOf = require('object-sizeof')

const { UserAutentication } = require('./User')

const table = {
    table: 'my_MovieRating',
    userId: 'userId',
	movieId: 'movieId',
	rate: 'rate'
}

var HandleSelectData = (movieId, callback) => {
	return new Promise((resolve, reject) => {
		if(movieId) {
            if (!isNaN(Number(movieId))) {
				resolve(`${table.movieId} = ${movieId}`)
            } else reject(db.message.dataError)            
		}
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (movieId, callback) => {
	return new Promise((resolve, reject) => {
		HandleSelectData(movieId, (error, result) => {
			error ? reject(error) : resolve(`SELECT AVG(${table.rate}), COUNT(${table.rate}) FROM ${table.table} WHERE ${result}`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (userId, movieId, rate, callback) => {
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
var CreateQueryInsert = (userId, movieId, rate, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(userId, movieId, rate, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (userId, movieId, rate, callback) => {
	return new Promise((resolve, reject) => {
		if (isNaN(Number(userId)) || isNaN(Number(movieId))) reject(db.message.dataError)
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
var CreateQueryUpdate = (userId, movieId, rate, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(userId, movieId, rate, (error, result) => {
			error 
			? reject(error) 
			: resolve(`UPDATE ${table.table} SET ${result} WHERE ${table.userId} = ${userId} AND ${table.movieId} = ${movieId} RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (userId, movieId, rate, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(movieId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(userId, movieId, rate, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(userId, movieId, rate, (error, result) => error ? reject(error) : resolve(result) )
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
var GetMovieRating = (movieId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(undefined, movieId, undefined, 'get', (error, result) => {
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

var CreateMovieRating = (userEmail, userPassword, userId, movieId, rate, callback) => {
	return new Promise((resolve, reject) => {
		UserAutentication(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result[0].id == userId) {
				CreateQuery(userId, movieId, rate, 'create', (error, result) => {
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

var UpdateMovieRating = (userEmail, userPassword, userId, movieId, rate, callback) => {
	return new Promise((resolve, reject) => {
		UserAutentication(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result[0].id == userId) {
				CreateQuery(userId, movieId, rate, 'update', (error, result) => {
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
  GetMovieRating,
  CreateMovieRating,
  UpdateMovieRating,
  table
}