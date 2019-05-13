const db = require('../../db')
const sizeOf = require('object-sizeof')

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_Movie',
    id: 'id',
	title: 'title',
	photo: 'photo',
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
				searchFor += `${table.id} = ${id}`
				numberParameters++
            } else reject(db.message.dataError)            
		}
		
        if (title) {
			if (numberParameters) searchFor += ' AND '
			searchFor += `${table.title} LIKE '%${title}%'`
		}

		if (releaseDate) {
			if (numberParameters) searchFor += ' AND '
			searchFor += `${table.releaseDate} = '${releaseDate}'`
		}

		if (durationMin || durationMax) {
			if (!isNaN(Number(durationMin)) && !isNaN(Number(durationMax))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.duration} BETWEEN ${durationMin} AND ${durationMax}`
				numberParameters++
            } else if (!isNaN(Number(durationMin))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.duration} >= ${durationMin}`
				numberParameters++
			} else if (!isNaN(Number(durationMax))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.duration} <= ${durationMax}`
				numberParameters++
			} else reject(db.message.dataError)
		}

		if (parentAdvisoryId) {
			if (!isNaN(Number(parentAdvisoryId))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.parentAdvisoryId} = ${parentAdvisoryId}`
				numberParameters++
            } else reject(db.message.dataError)
		}

		if (sagaId) {
			if (!isNaN(Number(sagaId))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.sagaId} = ${sagaId}`
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
				error ? reject(error) : resolve(`SELECT * FROM ${table.table} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${table.table}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (title, photo, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (title) {
			title = title.replace("'", '%27')
			fields += `${table.title}`
			values += `'${title}'`
			numberParameters++;
		}

		if (photo) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			fields += `${table.photo}`
			values += `decode('${photo}', 'hex')`
		}

		if (releaseDate) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			fields += `${table.releaseDate}`
			values += `'${releaseDate}'`
		}

		if (synopsis) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			synopsis = synopsis.replace("'", '%27')
			fields += `${table.synopsis}`
			values += `'${synopsis}'`
		}

		if (duration) {
			if (!isNaN(Number(duration))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.duration}`
				values += `${duration}`
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
var CreateQueryInsert = (title, photo, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(title, photo, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, title, photo, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
        let updateTo = '', numberParameters = 0
		
		if (isNaN(Number(id))) reject(db.message.dataError)
		
		if (title) {
			title = title.replace("'", '%27')
			updateTo += `${table.title} = '${title}'`
			numberParameters++;
		}

		if (photo) {
			if (numberParameters) updateTo += ', '
			updateTo += `${table.photo} = decode('${photo}', 'hex')`
			numberParameters++
		}

		if (releaseDate) {
			if (numberParameters) updateTo += ', '
			updateTo += `${table.releaseDate} = '${releaseDate}'`
			numberParameters++
		}

		if (synopsis) {
			if (numberParameters) updateTo += ', '
			synopsis = synopsis.replace("'", '%27')
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
var CreateQueryUpdate = (id, title, photo, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, title, photo, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, (error, result) => {
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

var CreateQuery = (id, title, photo, releaseDate, synopsis, duration, durationMin, durationMax, parentAdvisoryId, sagaId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, title, releaseDate, durationMin, durationMax, parentAdvisoryId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(title, photo, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, title, photo, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
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
		CreateQuery(id, title, undefined, releaseDate, undefined, undefined, durationMin, durationMax, parentAdvisoryId, sagaId, 'get', (error, result) => {
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

var CreateMovie = (userEmail, userPassword, title, photo, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(undefined, title, photo, releaseDate, synopsis, duration, undefined, undefined, parentAdvisoryId, sagaId, 'create', (error, result) => {
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

var UpdateMovie = (userEmail, userPassword, id, title, photo, releaseDate, synopsis, duration, parentAdvisoryId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, title, photo, releaseDate, synopsis, duration, undefined, undefined, parentAdvisoryId, sagaId, 'update', (error, result) => {
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

var DeleteMovie = (userEmail, userPassword, id, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
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
  GetMovie,
  CreateMovie,
  UpdateMovie,
  DeleteMovie,
  table
}