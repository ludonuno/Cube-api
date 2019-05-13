const db = require('../../db')
const sizeOf = require('object-sizeof')

const celebrityTable = require('./Celebrity').table
const assignmentTable = require('./Assignment').table
const movieTable = require('./Movie').table

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_CelebrityAssignmentMovie',
	celebrityId : 'celebrityId',
	assignmentId : 'assignmentId',
	movieId : 'movieId'
}

//TODO: alterar as celebrityId e movieTable para celebrityTable e assignmentTable
//TODO: adicionar a tabela movieTable nas queries

var HandleSelectData = (celebrityId, assignmentId, movieId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(celebrityId) {
            if (!isNaN(Number(celebrityId))) {
				fields = `${assignmentTable.table}.${assignmentTable.id}, ${assignmentTable.table}.${assignmentTable.description}, ${movieTable.table}.${movieTable.id}, ${movieTable.table}.${movieTable.title}, ${movieTable.table}.${movieTable.photo}, ${movieTable.table}.${movieTable.releaseDate}, ${movieTable.table}.${movieTable.synopsis}, ${movieTable.table}.${movieTable.duration}, ${movieTable.table}.${movieTable.parentAdvisoryId}, ${movieTable.table}.${movieTable.sagaId}`
				searchFor += `${table.celebrityId} = ${celebrityId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(assignmentId) {
            if (!isNaN(Number(assignmentId))) {
				fields = `${celebrityTable.table}.${celebrityTable.id}, ${celebrityTable.table}.${celebrityTable.name}, ${celebrityTable.table}.${celebrityTable.photo}, ${celebrityTable.table}.${celebrityTable.birthday}, ${celebrityTable.table}.${celebrityTable.biography}, ${movieTable.table}.${movieTable.id}, ${movieTable.table}.${movieTable.title}, ${movieTable.table}.${movieTable.photo}, ${movieTable.table}.${movieTable.releaseDate}, ${movieTable.table}.${movieTable.synopsis}, ${movieTable.table}.${movieTable.duration}, ${movieTable.table}.${movieTable.parentAdvisoryId}, ${movieTable.table}.${movieTable.sagaId}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.assignmentId} = ${assignmentId}`
            } else reject(db.message.dataError)            
		}

		if(movieId) {
            if (!isNaN(Number(movieId))) {
				fields = `${celebrityTable.table}.${celebrityTable.id}, ${celebrityTable.table}.${celebrityTable.name}, ${celebrityTable.table}.${celebrityTable.photo}, ${celebrityTable.table}.${celebrityTable.birthday}, ${celebrityTable.table}.${celebrityTable.biography}, ${assignmentTable.table}.${assignmentTable.id}, ${assignmentTable.table}.${assignmentTable.description}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.movieId} = ${movieId}`
            } else reject(db.message.dataError)            
		}

		resolve({fields, searchFor})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (celebrityId, assignmentId, movieId, callback) => {
	return new Promise((resolve, reject) => {
		if (celebrityId || assignmentId || movieId) {
			HandleSelectData(celebrityId, assignmentId, movieId, (error, result) => {
				error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId} INNER JOIN ${assignmentTable.table} ON ${assignmentTable.table}.${assignmentTable.id} = ${table.assignmentId} INNER JOIN ${movieTable.table} ON ${movieTable.table}.${movieTable.id} = ${table.movieId} WHERE ${result.searchFor} ORDER BY (${table.celebrityId}, ${table.assignmentId}, ${table.movieId})`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId} INNER JOIN ${assignmentTable.table} ON ${assignmentTable.table}.${assignmentTable.id} = ${table.assignmentId} INNER JOIN ${movieTable.table} ON ${movieTable.table}.${movieTable.id} = ${table.movieId} ORDER BY (${table.celebrityId}, ${table.assignmentId})`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (celebrityId, assignmentId, movieId, callback) => {
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
			} else reject(db.message.dataError)
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (celebrityId, assignmentId, movieId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(celebrityId, assignmentId, movieId, (error, result) => {
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
var CreateQueryDelete = (celebrityId, assignmentId, movieId, callback) => {
	return new Promise((resolve, reject) => {
		(!isNaN(Number(celebrityId)) && !isNaN(Number(assignmentId)) && !isNaN(Number(movieId)) )
		? resolve(`DELETE FROM ${table.table} WHERE ${table.celebrityId} = ${celebrityId} AND ${table.assignmentId} = ${assignmentId} AND ${table.movieId} = ${movieId} RETURNING *`) 
		: reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (celebrityId, assignmentId, movieId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(celebrityId, assignmentId, movieId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(celebrityId, assignmentId, movieId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(celebrityId, assignmentId, movieId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetCelebrityAssignmentMovie = (celebrityId, assignmentId, movieId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(celebrityId, assignmentId, movieId, 'get', (error, result) => {
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

var CreateCelebrityAssignmentMovie = (userEmail, userPassword, celebrityId, assignmentId, movieId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(celebrityId, assignmentId, movieId, 'create', (error, result) => {
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

var DeleteCelebrityAssignmentMovie = (userEmail, userPassword, celebrityId, assignmentId, movieId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(celebrityId, assignmentId, movieId, 'delete', (error, result) => {
					console.log(error, result)
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
  GetCelebrityAssignmentMovie,
  CreateCelebrityAssignmentMovie,
  DeleteCelebrityAssignmentMovie,
  table
}