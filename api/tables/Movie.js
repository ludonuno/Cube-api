const db = require('../../db')
const sizeOf = require('object-sizeof')

const { CanUserEdit } = require('./User')
const sagaTable = require('./Saga').table
const parentAdvisoryTable = require('./ParentAdvisory').table

const table = {
    table: 'my_Movie',
    id: 'id',
	title: 'title',
	releaseDate: 'releaseDate',
	synopsis: 'synopsis',
	duration: 'duration',
	parentAdvisoryId: 'parentAdvisoryId',
	sagaId: 'sagaId'
}

var HandleSelectData = (id, title, releaseDate, durationMin, durationMax, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		let searchFor = "", numberParameters = 0
		
        if(id) {
            if (!isNaN(Number(id))) {
				searchFor += `${table.table}.${table.id} = ${id}`
				numberParameters++
            } else reject(db.message.dataError)            
		}
		
        if (title) {
			if (numberParameters) searchFor += ' AND '
			title = title.replace( new RegExp("'", 'g') , '%27')
			searchFor += `${table.table}.${table.title} LIKE '%${title}%'`
		}

		if (releaseDate) {
			if (numberParameters) searchFor += ' AND '
			relereleaseDate = releaseDate.replace( new RegExp("'", 'g') , '%27')
			searchFor += `${table.table}.${table.releaseDate} = '${releaseDate}'`
		}

		if (durationMin || durationMax) {
			if (!isNaN(Number(durationMin)) && !isNaN(Number(durationMax))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.table}.${table.duration} BETWEEN ${durationMin} AND ${durationMax}`
				numberParameters++
            } else if (!isNaN(Number(durationMin))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.table}.${table.duration} >= ${durationMin}`
				numberParameters++
			} else if (!isNaN(Number(durationMax))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.table}.${table.duration} <= ${durationMax}`
				numberParameters++
			} else reject(db.message.dataError)
		}

		if (parentAdvisoryId) {
			if (!isNaN(Number(parentAdvisoryId))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.table}.${table.parentAdvisoryId} = ${parentAdvisoryId}`
				numberParameters++
            } else reject(db.message.dataError)
		}

		if (sagaId) {
			if (!isNaN(Number(sagaId))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.table}.${table.sagaId} = ${sagaId}`
				numberParameters++
            } else reject(db.message.dataError)
		}

		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, title, releaseDate, durationMin, durationMax, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		if (id || title || releaseDate || durationMin || durationMax || parentAdvisoryId || sagaId) {
			HandleSelectData(id, title, releaseDate, durationMin, durationMax, parentAdvisoryId, sagaId, (error, result) => {
				error ? reject(error) : resolve(`SELECT 
				${table.table}.${table.id} as "id",
				${table.table}.${table.title} as "title",
				${table.table}.${table.releaseDate} as "releaseDate",
				${table.table}.${table.synopsis} as "synopsis",
				${table.table}.${table.duration} as "duration",
				${sagaTable.table}.${sagaTable.id} as "sagaId",
				${sagaTable.table}.${sagaTable.name} as "sagaName",
				${sagaTable.table}.${sagaTable.description} as "sagaDescription",
				${parentAdvisoryTable.table}.${parentAdvisoryTable.id} as "parentAdvisoryId",
				${parentAdvisoryTable.table}.${parentAdvisoryTable.rate} as "parentAdvisoryRate",
				${parentAdvisoryTable.table}.${parentAdvisoryTable.description} as "parentAdvisoryDescription"
				FROM ${table.table} 
				INNER JOIN ${sagaTable.table} ON ${sagaTable.table}.${sagaTable.id} = ${table.table}.${table.sagaId}
				INNER JOIN ${parentAdvisoryTable.table} ON ${parentAdvisoryTable.table}.${parentAdvisoryTable.id} = ${table.table}.${table.parentAdvisoryId} 
				WHERE ${result}`)
			})
		} else resolve(`SELECT 
		${table.table}.${table.id} as "id",
		${table.table}.${table.title} as "title",
		${table.table}.${table.releaseDate} as "releaseDate",
		${table.table}.${table.synopsis} as "synopsis",
		${table.table}.${table.duration} as "duration",
		${sagaTable.table}.${sagaTable.id} as "sagaId",
		${sagaTable.table}.${sagaTable.name} as "sagaName",
		${sagaTable.table}.${sagaTable.description} as "sagaDescription",
		${parentAdvisoryTable.table}.${parentAdvisoryTable.id} as "parentAdvisoryId",
		${parentAdvisoryTable.table}.${parentAdvisoryTable.rate} as "parentAdvisoryRate",
		${parentAdvisoryTable.table}.${parentAdvisoryTable.description} as "parentAdvisoryDescription"
		FROM ${table.table} 
		INNER JOIN ${sagaTable.table} ON ${sagaTable.table}.${sagaTable.id} = ${table.table}.${table.sagaId}
		INNER JOIN ${parentAdvisoryTable.table} ON ${parentAdvisoryTable.table}.${parentAdvisoryTable.id} = ${table.table}.${table.parentAdvisoryId}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (title, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (title) {
			title = title.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.title}`
			values += `'${title}'`
			numberParameters++;
		}

		if (releaseDate) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			releaseDate = releaseDate.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.releaseDate}`
			values += `'${releaseDate}'`
			numberParameters++
		}

		if (synopsis) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			synopsis = synopsis.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.synopsis}`
			values += `'${synopsis}'`
			numberParameters++
		}

		if (duration) {
			if (!isNaN(Number(duration))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.duration}`
				values += `${duration}`
				numberParameters++
            } else reject(db.message.dataError) 
		}

		if (parentAdvisoryId) {
			if (!isNaN(Number(parentAdvisoryId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.parentAdvisoryId}`
				values += `${parentAdvisoryId}`
				numberParameters++
            } else reject(db.message.dataError) 
		}

		if (sagaId) {
			if (!isNaN(Number(sagaId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.sagaId}`
				values += `${sagaId}`
            } else reject(db.message.dataError) 
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (title, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(title, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, title, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
        let updateTo = '', numberParameters = 0
		
		if (isNaN(Number(id))) reject(db.message.dataError)
		
		if (title) {
			title = title.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.title} = '${title}'`
			numberParameters++;
		}

		if (releaseDate) {
			if (numberParameters) updateTo += ', '
			releaseDate = releaseDate.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.releaseDate} = '${releaseDate}'`
			numberParameters++
		}

		if (synopsis) {
			if (numberParameters) updateTo += ', '
			synopsis = synopsis.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.synopsis} = '${synopsis}'`
			numberParameters++
		}

		if (duration) {
			if (!isNaN(Number(duration))) {
				if (numberParameters) updateTo += ', '
				updateTo += `${table.duration} = ${duration}`
				numberParameters++
            } else reject(db.message.dataError) 
		}

		if (parentAdvisoryId) {
			if (!isNaN(Number(parentAdvisoryId))) {
				if (numberParameters) updateTo += ', '
				updateTo += `${table.parentAdvisoryId} = ${parentAdvisoryId}`
				numberParameters++
            } else reject(db.message.dataError) 
		}

		if (sagaId) {
			if (!isNaN(Number(sagaId))) {
				if (numberParameters) updateTo += ', '
				updateTo += `${table.sagaId} = ${sagaId}`
				numberParameters++
            } else reject(db.message.dataError) 
		}

		resolve(updateTo)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Update an existing record and return the value updated
var CreateQueryUpdate = (id, title, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, title, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, (error, result) => {
			error 
			? reject(db.message.dataError) 
			: resolve(`UPDATE ${table.table} SET ${result} WHERE ${table.id} = ${id} RETURNING *`)
		})
		
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Delete an existing record and return the value deleted
var CreateQueryDelete = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${table.table} WHERE ${table.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (id, title, releaseDate, synopsis, duration, durationMin, durationMax, parentAdvisoryId, sagaId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, title, releaseDate, durationMin, durationMax, parentAdvisoryId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(title, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, title, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(id, (error, result) => error ? reject(error) : resolve(result) )
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
var GetMovie = (id, title, releaseDate, durationMin, durationMax, parentAdvisoryId, sagaId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, title, releaseDate, undefined, undefined, durationMin, durationMax, parentAdvisoryId, sagaId, 'get', (error, result) => {
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

var CreateMovie = (userEmail, userPassword, title, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(undefined, title, releaseDate, synopsis, duration, undefined, undefined, parentAdvisoryId, sagaId, 'create', (error, result) => {
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

var UpdateMovie = (userEmail, userPassword, id, title, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, title, releaseDate, synopsis, duration, undefined, undefined, parentAdvisoryId, sagaId, 'update', (error, result) => {
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

var DeleteMovie = (userEmail, userPassword, id, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
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
  GetMovie,
  CreateMovie,
  UpdateMovie,
  DeleteMovie,
  table
}