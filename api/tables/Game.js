const db = require('../../db')
const sizeOf = require('object-sizeof')

const { CanUserEdit } = require('./User')
const sagaTable = require('./Saga').table
const parentAdvisoryTable = require('./ParentAdvisory').table
const engineTable = require('./Engine').table
const companyTable = require('./Company').table

const table = {
    table: 'my_Game',
    id: 'id',
	title: 'title',
	releaseDate: 'releaseDate',
	synopsis: 'synopsis',
	engineId: 'engineId',
	parentAdvisoryId: 'parentAdvisoryId',
	publicadorId: 'publicadorId',
	sagaId: 'sagaId'
}

var HandleSelectData = (id, title, releaseDate, engineId, parentAdvisoryId, publicadorId, sagaId, callback) => {
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
			releaseDate = releaseDate.replace( new RegExp("'", 'g') , '%27')
			searchFor += `${table.table}.${table.releaseDate} = '${releaseDate}'`
		}

		if (engineId) {
			if (!isNaN(Number(engineId))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.table}.${table.engineId} = ${engineId}`
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
		
		if (publicadorId) {
			if (!isNaN(Number(publicadorId))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.table}.${table.publicadorId} = ${publicadorId}`
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

var CreateQuerySelect = (id, title, releaseDate, engineId, parentAdvisoryId, publicadorId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		if (id || title || releaseDate || engineId || parentAdvisoryId || publicadorId || sagaId) {
			HandleSelectData(id, title, releaseDate, engineId, parentAdvisoryId, publicadorId, sagaId, (error, result) => {
				error ? reject(error) : resolve(`SELECT
				${table.table}.${table.id} as "id",
				${table.table}.${table.title} as "title",
				${table.table}.${table.releaseDate} as "releaseDate",
				${table.table}.${table.synopsis} as "synopsis",
				${sagaTable.table}.${sagaTable.id} as "sagaId",
				${sagaTable.table}.${sagaTable.name} as "sagaName",
				${sagaTable.table}.${sagaTable.description} as "sagaDescription",
				${parentAdvisoryTable.table}.${parentAdvisoryTable.id} as "parentAdvisoryId",
				${parentAdvisoryTable.table}.${parentAdvisoryTable.rate} as "parentAdvisoryRate",
				${parentAdvisoryTable.table}.${parentAdvisoryTable.description} as "parentAdvisoryDescription",
				${engineTable.table}.${engineTable.id} as "engineId",
				${engineTable.table}.${engineTable.name} as "engineName",
				${companyTable.table}.${companyTable.id} as "companyId",
				${companyTable.table}.${companyTable.name} as "companyName"
				FROM ${table.table}
				INNER JOIN ${sagaTable.table} ON ${sagaTable.table}.${sagaTable.id} = ${table.table}.${table.sagaId}
				INNER JOIN ${parentAdvisoryTable.table} ON ${parentAdvisoryTable.table}.${parentAdvisoryTable.id} = ${table.table}.${table.parentAdvisoryId}
				INNER JOIN ${engineTable.table} ON ${engineTable.table}.${engineTable.id} = ${table.table}.${table.engineId}
				INNER JOIN ${companyTable.table} ON ${companyTable.table}.${companyTable.id} = ${table.table}.${table.publicadorId}
				WHERE ${result}`)
			})
		} else resolve(`SELECT
		${table.table}.${table.id} as "id",
		${table.table}.${table.title} as "title",
		${table.table}.${table.releaseDate} as "releaseDate",
		${table.table}.${table.synopsis} as "synopsis",
		${sagaTable.table}.${sagaTable.id} as "sagaId",
		${sagaTable.table}.${sagaTable.name} as "sagaName",
		${sagaTable.table}.${sagaTable.description} as "sagaDescription",
		${parentAdvisoryTable.table}.${parentAdvisoryTable.id} as "parentAdvisoryId",
		${parentAdvisoryTable.table}.${parentAdvisoryTable.rate} as "parentAdvisoryRate",
		${parentAdvisoryTable.table}.${parentAdvisoryTable.description} as "parentAdvisoryDescription",
		${engineTable.table}.${engineTable.id} as "engineId",
		${engineTable.table}.${engineTable.name} as "engineName",
		${companyTable.table}.${companyTable.id} as "companyId",
		${companyTable.table}.${companyTable.name} as "companyName"
		FROM ${table.table}
		INNER JOIN ${sagaTable.table} ON ${sagaTable.table}.${sagaTable.id} = ${table.table}.${table.sagaId}
		INNER JOIN ${parentAdvisoryTable.table} ON ${parentAdvisoryTable.table}.${parentAdvisoryTable.id} = ${table.table}.${table.parentAdvisoryId}
		INNER JOIN ${engineTable.table} ON ${engineTable.table}.${engineTable.id} = ${table.table}.${table.engineId}
		INNER JOIN ${companyTable.table} ON ${companyTable.table}.${companyTable.id} = ${table.table}.${table.publicadorId}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, callback) => {
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

		if (engineId) {
			if (!isNaN(Number(engineId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.engineId}`
				values += `${engineId}`
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

		if (publicadorId) {
			if (!isNaN(Number(publicadorId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.publicadorId}`
				values += `${publicadorId}`
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
var CreateQueryInsert = (title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, callback) => {
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

		if (engineId) {
			if (!isNaN(Number(engineId))) {
				if (numberParameters) updateTo += ', '
				updateTo += `${table.engineId} = ${engineId}`
				numberParameters++
            } else reject(db.message.dataError) 
		}

		if (parentAdvisoryId) {
			if (!isNaN(Number(engineId))) {
				if (numberParameters) updateTo += ', '
				updateTo += `${table.parentAdvisoryId} = ${parentAdvisoryId}`
				numberParameters++
            } else reject(db.message.dataError) 
		}

		if (publicadorId) {
			if (!isNaN(Number(publicadorId))) {
				if (numberParameters) updateTo += ', '
				updateTo += `${table.publicadorId} = ${publicadorId}`
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
var CreateQueryUpdate = (id, title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, (error, result) => {
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

var CreateQuery = (id, title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, title, releaseDate, engineId, parentAdvisoryId, publicadorId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetGame = (id, title, releaseDate, engineId, parentAdvisoryId, publicadorId, sagaId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, title, releaseDate, undefined, engineId, parentAdvisoryId, publicadorId, sagaId, 'get', (error, result) => {
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

var CreateGame = (userEmail, userPassword, title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(undefined, title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, 'create', (error, result) => {
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

var UpdateGame = (userEmail, userPassword, id, title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, title, releaseDate, synopsis, engineId, parentAdvisoryId, publicadorId, sagaId, 'update', (error, result) => {
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

var DeleteGame = (userEmail, userPassword, id, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
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
  GetGame,
  CreateGame,
  UpdateGame,
  DeleteGame,
  table
}