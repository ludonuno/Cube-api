const db = require('../../db')
const sizeOf = require('object-sizeof')

const bookTable = require('./Book').table

const { UserAutentication } = require('./User')

const table = {
    table: 'my_BookRating',
    userId: 'userId',
	bookId: 'bookId',
	rate: 'rate'
}

var HandleSelectData = (bookId, callback) => {
	return new Promise((resolve, reject) => {
		if(bookId) {
            if (!isNaN(Number(bookId))) {
				resolve(`${table.bookId} = ${bookId}`)
            } else reject(db.message.dataError)            
		}
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (userId, bookId, callback) => {
	return new Promise((resolve, reject) => {
		if(userId) {
			resolve(`SELECT * FROM ${table.table} WHERE ${table.userId} = ${userId} AND ${table.bookId} = ${bookId}`)
		} else {
			HandleSelectData(bookId, (error, result) => {
				error ? reject(error) : resolve(`SELECT AVG(${table.rate}), COUNT(${table.rate}) FROM ${table.table} WHERE ${result}`)
			})
		}
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (userId, bookId, rate, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0
		if (userId) {
			if (!isNaN(Number(userId))) {
				fields += `${table.userId}`
				values += `${userId}`
				numberParameters++
			} else reject(db.message.dataError)
		}

		if (bookId) {
			if (!isNaN(Number(bookId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.bookId}`
				values += `${bookId}`
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
var CreateQueryInsert = (userId, bookId, rate, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(userId, bookId, rate, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (userId, bookId, rate, callback) => {
	return new Promise((resolve, reject) => {
		if (isNaN(Number(userId)) || isNaN(Number(bookId))) reject(db.message.dataError)
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
var CreateQueryUpdate = (userId, bookId, rate, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(userId, bookId, rate, (error, result) => {
			error 
			? reject(error) 
			: resolve(`UPDATE ${table.table} SET ${result} WHERE ${table.userId} = ${userId} AND ${table.bookId} = ${bookId} RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (userId, bookId, rate, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(userId, bookId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(userId, bookId, rate, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(userId, bookId, rate, (error, result) => error ? reject(error) : resolve(result) )
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
var GetBookRating = (bookId, userId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(userId, bookId, undefined, 'get', (error, result) => {
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

var CreateBookRating = (userEmail, userPassword, userId, bookId, rate, callback) => {
	return new Promise((resolve, reject) => {
		UserAutentication(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result[0].id == userId) {
				GetBookRating(bookId, userId, (err, res) => {
					if(error == db.message.dataNotFound) {
						CreateQuery(userId, bookId, rate, 'create', (error, result) => {
							error ? reject(error) : db.query(result, (error, result) => {
								error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
							})
						})
					} else if(result) {
						CreateQuery(userId, bookId, rate, 'update', (error, result) => {
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
  GetBookRating,
  CreateBookRating,  table
}