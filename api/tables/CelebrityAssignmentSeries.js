const db = require('../../db')
const sizeOf = require('object-sizeof')

const celebrityTable = require('./Celebrity').table
const assignmentTable = require('./Assignment').table
const seriesTable = require('./Series').table

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_CelebrityAssignmentSeries',
	celebrityId : 'celebrityId',
	assignmentId : 'assignmentId',
	seriesId : 'seriesId'
}

var HandleSelectData = (celebrityId, assignmentId, seriesId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(celebrityId) {
            if (!isNaN(Number(celebrityId))) {
				fields = `${assignmentTable.table}.${assignmentTable.id}, ${assignmentTable.table}.${assignmentTable.description}, ${seriesTable.table}.${seriesTable.id}, ${seriesTable.table}.${seriesTable.title}, ${seriesTable.table}.${seriesTable.releaseDate}, ${seriesTable.table}.${seriesTable.synopsis}, ${seriesTable.table}.${seriesTable.parentAdvisoryId}, ${seriesTable.table}.${seriesTable.sagaId}`
				searchFor += `${table.celebrityId} = ${celebrityId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(assignmentId) {
            if (!isNaN(Number(assignmentId))) {
				fields = `${celebrityTable.table}.${celebrityTable.id}, ${celebrityTable.table}.${celebrityTable.name}, ${celebrityTable.table}.${celebrityTable.birthday}, ${celebrityTable.table}.${celebrityTable.biography}, ${seriesTable.table}.${seriesTable.id}, ${seriesTable.table}.${seriesTable.title}, ${seriesTable.table}.${seriesTable.releaseDate}, ${seriesTable.table}.${seriesTable.synopsis}, ${seriesTable.table}.${seriesTable.parentAdvisoryId}, ${seriesTable.table}.${seriesTable.sagaId}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.assignmentId} = ${assignmentId}`
				numberParameters++
            } else reject(db.message.dataError)            
		}

		if(seriesId) {
            if (!isNaN(Number(seriesId))) {
				fields = `${celebrityTable.table}.${celebrityTable.id}, ${celebrityTable.table}.${celebrityTable.name}, ${celebrityTable.table}.${celebrityTable.birthday}, ${celebrityTable.table}.${celebrityTable.biography}, ${assignmentTable.table}.${assignmentTable.id}, ${assignmentTable.table}.${assignmentTable.description}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.seriesId} = ${seriesId}`
            } else reject(db.message.dataError)            
		}

		resolve({fields, searchFor})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (celebrityId, assignmentId, seriesId, callback) => {
	return new Promise((resolve, reject) => {
		if (celebrityId || assignmentId || seriesId) {
			HandleSelectData(celebrityId, assignmentId, seriesId, (error, result) => {
				error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId} INNER JOIN ${assignmentTable.table} ON ${assignmentTable.table}.${assignmentTable.id} = ${table.assignmentId} INNER JOIN ${seriesTable.table} ON ${seriesTable.table}.${seriesTable.id} = ${table.seriesId} WHERE ${result.searchFor} ORDER BY (${table.celebrityId}, ${table.assignmentId}, ${table.seriesId})`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId} INNER JOIN ${assignmentTable.table} ON ${assignmentTable.table}.${assignmentTable.id} = ${table.assignmentId} INNER JOIN ${seriesTable.table} ON ${seriesTable.table}.${seriesTable.id} = ${table.seriesId} ORDER BY (${table.celebrityId}, ${table.assignmentId})`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (celebrityId, assignmentId, seriesId, callback) => {
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

		if (seriesId) {
			if (!isNaN(Number(seriesId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.seriesId}`
				values += `${seriesId}`
			} else reject(db.message.dataError)
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (celebrityId, assignmentId, seriesId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(celebrityId, assignmentId, seriesId, (error, result) => {
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
var CreateQueryDelete = (celebrityId, assignmentId, seriesId, callback) => {
	return new Promise((resolve, reject) => {
		(!isNaN(Number(celebrityId)) && !isNaN(Number(assignmentId)) && !isNaN(Number(seriesId)) )
		? resolve(`DELETE FROM ${table.table} WHERE ${table.celebrityId} = ${celebrityId} AND ${table.assignmentId} = ${assignmentId} AND ${table.seriesId} = ${seriesId} RETURNING *`) 
		: reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (celebrityId, assignmentId, seriesId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(celebrityId, assignmentId, seriesId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(celebrityId, assignmentId, seriesId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(celebrityId, assignmentId, seriesId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetCelebrityAssignmentSeries = (celebrityId, assignmentId, seriesId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(celebrityId, assignmentId, seriesId, 'get', (error, result) => {
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

var CreateCelebrityAssignmentSeries = (userEmail, userPassword, celebrityId, assignmentId, seriesId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(celebrityId, assignmentId, seriesId, 'create', (error, result) => {
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

var DeleteCelebrityAssignmentSeries = (userEmail, userPassword, celebrityId, assignmentId, seriesId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(celebrityId, assignmentId, seriesId, 'delete', (error, result) => {
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
  GetCelebrityAssignmentSeries,
  CreateCelebrityAssignmentSeries,
  DeleteCelebrityAssignmentSeries,
  table
}