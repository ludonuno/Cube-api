const db = require('../../db')
const sizeOf = require('object-sizeof')

const celebrityTable = require('./Celebrity').table
const assignmentTable = require('./Assignment').table
const bookTable = require('./Book').table

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_CelebrityAssignmentBook',
	celebrityId : 'celebrityId',
	assignmentId : 'assignmentId',
	bookId : 'bookId'
}

var HandleSelectData = (celebrityId, assignmentId, bookId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(celebrityId) {
            if (!isNaN(Number(celebrityId))) {
				fields = `${assignmentTable.table}.${assignmentTable.id}, ${assignmentTable.table}.${assignmentTable.description}, ${bookTable.table}.${bookTable.id}, ${bookTable.table}.${bookTable.title}, ${bookTable.table}.${bookTable.releaseDate}, ${bookTable.table}.${bookTable.synopsis}, ${bookTable.table}.${bookTable.publishingCompanyId}, ${bookTable.table}.${bookTable.sagaId}`
				searchFor += `${table.celebrityId} = ${celebrityId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(assignmentId) {
            if (!isNaN(Number(assignmentId))) {
				fields = `${celebrityTable.table}.${celebrityTable.id}, ${celebrityTable.table}.${celebrityTable.name}, ${celebrityTable.table}.${celebrityTable.birthday}, ${celebrityTable.table}.${celebrityTable.biography}, ${bookTable.table}.${bookTable.id}, ${bookTable.table}.${bookTable.title}, ${bookTable.table}.${bookTable.releaseDate}, ${bookTable.table}.${bookTable.synopsis}, ${bookTable.table}.${bookTable.publishingCompanyId}, ${bookTable.table}.${bookTable.sagaId}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.assignmentId} = ${assignmentId}`
				numberParameters++
            } else reject(db.message.dataError)            
		}

		if(bookId) {
            if (!isNaN(Number(bookId))) {
				fields = `${celebrityTable.table}.${celebrityTable.id}, ${celebrityTable.table}.${celebrityTable.name}, ${celebrityTable.table}.${celebrityTable.birthday}, ${celebrityTable.table}.${celebrityTable.biography}, ${assignmentTable.table}.${assignmentTable.id}, ${assignmentTable.table}.${assignmentTable.description}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.bookId} = ${bookId}`
            } else reject(db.message.dataError)            
		}

		resolve({fields, searchFor})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (celebrityId, assignmentId, bookId, callback) => {
	return new Promise((resolve, reject) => {
		if (celebrityId || assignmentId || bookId) {
			HandleSelectData(celebrityId, assignmentId, bookId, (error, result) => {
				error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId} INNER JOIN ${assignmentTable.table} ON ${assignmentTable.table}.${assignmentTable.id} = ${table.assignmentId} INNER JOIN ${bookTable.table} ON ${bookTable.table}.${bookTable.id} = ${table.bookId} WHERE ${result.searchFor} ORDER BY (${table.celebrityId}, ${table.assignmentId}, ${table.bookId})`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId} INNER JOIN ${assignmentTable.table} ON ${assignmentTable.table}.${assignmentTable.id} = ${table.assignmentId} INNER JOIN ${bookTable.table} ON ${bookTable.table}.${bookTable.id} = ${table.bookId} ORDER BY (${table.celebrityId}, ${table.assignmentId})`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (celebrityId, assignmentId, bookId, callback) => {
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

		if (bookId) {
			if (!isNaN(Number(bookId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.bookId}`
				values += `${bookId}`
			} else reject(db.message.dataError)
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (celebrityId, assignmentId, bookId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(celebrityId, assignmentId, bookId, (error, result) => {
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
var CreateQueryDelete = (celebrityId, assignmentId, bookId, callback) => {
	return new Promise((resolve, reject) => {
		(!isNaN(Number(celebrityId)) && !isNaN(Number(assignmentId)) && !isNaN(Number(bookId)) )
		? resolve(`DELETE FROM ${table.table} WHERE ${table.celebrityId} = ${celebrityId} AND ${table.assignmentId} = ${assignmentId} AND ${table.bookId} = ${bookId} RETURNING *`) 
		: reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (celebrityId, assignmentId, bookId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(celebrityId, assignmentId, bookId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(celebrityId, assignmentId, bookId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(celebrityId, assignmentId, bookId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetCelebrityAssignmentBook = (celebrityId, assignmentId, bookId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(celebrityId, assignmentId, bookId, 'get', (error, result) => {
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

var CreateCelebrityAssignmentBook = (userEmail, userPassword, celebrityId, assignmentId, bookId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(celebrityId, assignmentId, bookId, 'create', (error, result) => {
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

var DeleteCelebrityAssignmentBook = (userEmail, userPassword, celebrityId, assignmentId, bookId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(celebrityId, assignmentId, bookId, 'delete', (error, result) => {
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
  GetCelebrityAssignmentBook,
  CreateCelebrityAssignmentBook,
  DeleteCelebrityAssignmentBook,
  table
}