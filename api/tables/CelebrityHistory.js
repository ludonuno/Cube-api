const db = require('../../db')
const sizeOf = require('object-sizeof')

const userTable = require('./User').table
const celebrityTable = require('./Celebrity').table

//TODO: REFAZER ISTO

const { CanUserEdit, UserAutentication } = require('./User')

const table = {
	table: 'my_CelebrityHistory',
	id: 'id',
	userId : 'userId',
	celebrityId : 'celebrityId',
	searchedWhen : 'searchedWhen'
}

var HandleSelectData = (celebrityId, userId, callback) => {
	return new Promise((resolve, reject) => {
		let fields = "", searchFor = "", numberParameters = 0
		
		if(userId) {
			if (!isNaN(Number(userId))) {
				fields = `${table.table}.${table.id}, ${celebrityTable.table}.${celebrityTable.name}, ${celebrityTable.table}.${celebrityTable.photo}, ${celebrityTable.table}.${celebrityTable.birthday}, ${celebrityTable.table}.${celebrityTable.biography}, ${table.searchedWhen}`
				searchFor += `${table.userId} = ${userId}`
				numberParameters++
			} else reject(db.message.dataError)            
		}

		if(celebrityId) {
			if (!isNaN(Number(celebrityId))) {
				if(numberParameters) searchFor += ' AND '
				searchFor += `${table.celebrityId} = ${celebrityId}`
			}
		}

		resolve({fields, searchFor})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (celebrityId, userId, callback) => {
	return new Promise((resolve, reject) => {
		HandleSelectData(celebrityId, userId, (error, result) => {
			error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId} WHERE ${result.searchFor} ORDER BY (${table.id}) DESC`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (celebrityId, userId, callback) => {
	return new Promise((resolve, reject) => {
		let fields = '', values = '', numberParameters = 0

		if (celebrityId) {
			if (!isNaN(Number(celebrityId))) {
				fields += `${table.celebrityId}`
				values += `${celebrityId}`
				numberParameters++
			} else reject(db.message.dataError)
		}

		if (userId) {
			if (!isNaN(Number(userId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.userId}`
				values += `${userId}`
			} else reject(db.message.dataError)
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (celebrityId, userId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(celebrityId, userId, (error, result) => {
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
var CreateQueryDelete = (celebrityId, userId, callback) => {
	return new Promise((resolve, reject) => {
		(!isNaN(Number(userId)))
		? resolve(`DELETE FROM ${table.table} WHERE ${table.userId} = ${userId} RETURNING *`) 
		: reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (celebrityId, userId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(celebrityId, userId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
				CreateQueryInsert(celebrityId, userId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
				CreateQueryDelete(userId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetCelebrityHistory = (userEmail, userPassword, celebrityId, userId, callback) => {
  	return new Promise((resolve, reject) => {
		UserAutentication(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result[0].id == userId) {
				CreateQuery(celebrityId, userId, 'get', (error, result) => {
					console.log(error, result)
					error ? reject(error) :	db.query(result, (error, result) => {
						if (error) reject(db.message.internalError)
						else if (!sizeOf(result)) reject(db.message.dataNotFound)
						else resolve(result)
					})
				})
			} else reject('Não tem permissões para esta ação')
		})
		
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}		

var CreateCelebrityHistory = (userEmail, userPassword, celebrityId, userId, callback) => {
	return new Promise((resolve, reject) => {
		GetCelebrityHistory(userEmail, userPassword, celebrityId, userId, (error, result) => {
			if(result || error == db.message.dataNotFound) {
				if(result) { //apagar resultado(s) existentes e adicionar um novo registo à base de dados
					DeleteOldestCelebrityHistory(celebrityId, userId, result, (error, result) => {
						error ? reject(error) : CreateQuery(celebrityId, userId, 'create', (error, result) => {
							console.log(error, result)
							error ? reject(error) : db.query(result, (error, result) => {
								error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate})
							})	
						})
					})
				} else { //adicionar registo à base de dados
					CreateQuery(celebrityId, userId, 'create', (error, result) => {
						error ? reject(error) : db.query(result, (error, result) => {
							error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate})
						})	
					})
				}
			} else reject(error)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteOldestCelebrityHistory = (celebrityId, userId, callback) => {
	//query = `DELETE FROM ${table.table} WHERE ctid IN (SELECT ctid FROM  ${table.table} where ${table.userId} = ${userId} ORDER BY (${table.id}) ASC LIMIT ${result.length - 5})`
	return new Promise((resolve, reject) => {
		let query =`DELETE FROM ${table.table} WHERE ctid IN (SELECT ${table.id}, ${table.userId}, ${table.celebrityId} FROM ${table.table} WHERE ${table.userId} = ${userId} AND ${table.celebrityId} = ${celebrityId})`
		db.query(query, (error, result) => {
			if (error) reject(error)
			else {
				
			}
		})
			// if (result.length >= 5) {
			// 	// let query = `DELETE FROM ${table.table} WHERE ctid IN (SELECT ctid FROM ${table.table} WHERE ${table.id} IN (SELECT ${table.id} FROM ${table.table} WHERE ${table.userId} = ${userId} ORDER BY (${table.id}) ASC) OR ${table.celebrityId} = ${celebrityId} AND ${table.userId} = ${userId} ORDER BY (${table.id}) ASC LIMIT (SELECT COUNT(*) FROM ${table.table} WHERE ${table.celebrityId} = ${celebrityId} AND ${table.userId} = ${userId}))`
			// 	// console.log(query)
			// 	// db.query(query, (error, result) => {
			// 	// 	error 
			// 	// 	? reject(error) 
			// 	// 	: resolve('Registos antigos apagados')
			// 	// })
			// } else {
			// 	let query = `DELETE FROM ${table.table} WHERE ctid IN (SELECT ctid FROM ${table.table} WHERE ${table.celebrityId} = ${celebrityId} AND ${table.userId} = ${userId} ORDER BY (${table.id}) ASC)`
			// 	db.query(query, (error, result) => {
			// 		error 
			// 		? reject(error) 
			// 		: resolve('Registos antigos apagados')
			// 	})
			// }
		
		
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

module.exports = {
  GetCelebrityHistory,
  CreateCelebrityHistory,
  table
}