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

var HandleSelectData = (celebrityId, assignmentId, movieId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(celebrityId) {
            if (!isNaN(Number(celebrityId))) {
				fields = `${assignmentTable.table}.${assignmentTable.id} as "assignmentId",
				${assignmentTable.table}.${assignmentTable.description} as "assignmentDescription",
				${movieTable.table}.${movieTable.id} as "movieId",
				${movieTable.table}.${movieTable.title} as "movieTitle",
				${movieTable.table}.${movieTable.releaseDate} as "movieReleaseDate",
				${movieTable.table}.${movieTable.synopsis} as "movieSynopsis",
				${movieTable.table}.${movieTable.duration} as "movieDuration"`
				searchFor += `${table.celebrityId} = ${celebrityId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(assignmentId) {
            if (!isNaN(Number(assignmentId))) {
				fields = `${celebrityTable.table}.${celebrityTable.id} as "celebrityId",
				${celebrityTable.table}.${celebrityTable.name} as "celebrityName",
				${celebrityTable.table}.${celebrityTable.birthday} as "celebrityBirthday",
				${celebrityTable.table}.${celebrityTable.biography} as "celebrityBiography",
				${movieTable.table}.${movieTable.id} as "movieId",
				${movieTable.table}.${movieTable.title} as "movieTitle",
				${movieTable.table}.${movieTable.releaseDate} as "movieReleaseDate",
				${movieTable.table}.${movieTable.synopsis} as "movieSynopsis",
				${movieTable.table}.${movieTable.duration} as "movieDuration"`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.assignmentId} = ${assignmentId}`
				numberParameters++
            } else reject(db.message.dataError)            
		}

		if(movieId) {
            if (!isNaN(Number(movieId))) {
				fields = `${celebrityTable.table}.${celebrityTable.id} as "celebrityId",
				${celebrityTable.table}.${celebrityTable.name} as "celebrityName",
				${celebrityTable.table}.${celebrityTable.birthday} as "celebrityBirthday",
				${celebrityTable.table}.${celebrityTable.biography} as "celebrityBiography",
				${assignmentTable.table}.${assignmentTable.id} as "assignmentId",
				${assignmentTable.table}.${assignmentTable.description} as "assignmentDescription"`
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
				error ? reject(error) : resolve(`SELECT ${result.fields}
				FROM ${table.table}
				INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId}
				INNER JOIN ${assignmentTable.table} ON ${assignmentTable.table}.${assignmentTable.id} = ${table.assignmentId}
				INNER JOIN ${movieTable.table} ON ${movieTable.table}.${movieTable.id} = ${table.movieId}
				WHERE ${result.searchFor}
				ORDER BY (${table.celebrityId}, ${table.assignmentId}, ${table.movieId})`)
			})
		} else resolve(`SELECT
		${celebrityTable.table}.${celebrityTable.id} as "celebrityId",
		${celebrityTable.table}.${celebrityTable.name} as "celebrityName",
		${celebrityTable.table}.${celebrityTable.birthday} as "celebrityBirthday",
		${celebrityTable.table}.${celebrityTable.biography} as "celebrityBiography",
		${assignmentTable.table}.${assignmentTable.id} as "assignmentId",
		${assignmentTable.table}.${assignmentTable.assignment} as "assignmentName",
		${assignmentTable.table}.${assignmentTable.description} as "assignmentDescription",
		${movieTable.table}.${movieTable.id} as "movieId",
		${movieTable.table}.${movieTable.title} as "movieTitle",
		${movieTable.table}.${movieTable.releaseDate} as "movieReleaseDate",
		${movieTable.table}.${movieTable.synopsis} as "movieSynopsis",
		${movieTable.table}.${movieTable.duration} as "movieDuration" 
		FROM ${table.table}
		INNER JOIN ${celebrityTable.table} ON ${celebrityTable.table}.${celebrityTable.id} = ${table.celebrityId}
		INNER JOIN ${assignmentTable.table} ON ${assignmentTable.table}.${assignmentTable.id} = ${table.assignmentId}
		INNER JOIN ${movieTable.table} ON ${movieTable.table}.${movieTable.id} = ${table.movieId}
		ORDER BY (${table.celebrityId}, ${table.assignmentId})`)
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
		GetCelebrityAssignmentMovie(celebrityId, assignmentId, movieId, (error, result) => {
			if(error == db.message.dataNotFound) {
				CanUserEdit(userEmail, userPassword, (error, result) => {
					if (error) reject(error)
					else if(result) {
						CreateQuery(celebrityId, assignmentId, movieId, 'create', (error, result) => {
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

var DeleteCelebrityAssignmentMovie = (userEmail, userPassword, celebrityId, assignmentId, movieId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(celebrityId, assignmentId, movieId, 'delete', (error, result) => {
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