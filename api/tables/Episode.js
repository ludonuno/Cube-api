const db = require('../../db')
const sizeOf = require('object-sizeof')

const { CanUserEdit } = require('./User')
const seriesTable = require('./Series').table
const seasonTable = require('./Season').table
const sagaTable = require('./Saga').table
const parentAdvisoryTable = require('./ParentAdvisory').table

const table = {
    table: 'my_Episode',
    id: 'id',
	title: 'title',
	releaseDate: 'releaseDate',
	synopsis: 'synopsis',
	seasonId: 'seasonId'
}

var HandleSelectData = (id, title, releaseDate, seasonId, callback) => {
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
			numberParameters++
		}

		if (releaseDate) {
			if (numberParameters) searchFor += ' AND '
			releaseDate = releaseDate.replace( new RegExp("'", 'g') , '%27')
			searchFor += `${table.table}.${table.releaseDate} = '${releaseDate}'`
			numberParameters++
		}

		if (seasonId) {
			if (!isNaN(Number(seasonId))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.table}.${table.seasonId} = ${seasonId}`
				numberParameters++
            } else reject(db.message.dataError)
		}

		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, title, releaseDate, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		if (id || title || releaseDate || seasonId) {
			HandleSelectData(id, title, releaseDate, seasonId, (error, result) => {
				error ? reject(error) : resolve(`SELECT
				${table.table}.${table.id} as "id",
				${table.table}.${table.title}  as "title", 
				${table.table}.${table.releaseDate} as "releaseDate",
				${table.table}.${table.synopsis} as "synopsis",
				${seasonTable.table}.${seasonTable.id} as "seasonId",
				${seasonTable.table}.${seasonTable.title} as "seasonTitle",
				${seasonTable.table}.${seasonTable.releaseDate} as "seasonReleaseDate",
				${seasonTable.table}.${seasonTable.synopsis} as "seasonSynopsis",
				${seriesTable.table}.${seriesTable.id} as "seriesId",
				${seriesTable.table}.${seriesTable.title} as "seriesTitle",
				${seriesTable.table}.${seriesTable.releaseDate} as "seriesReleaseDate",
				${seriesTable.table}.${seriesTable.synopsis} as "seriesSynopsis",
				${sagaTable.table}.${sagaTable.id} as "sagaId",
				${sagaTable.table}.${sagaTable.name} as "sagaName",
				${sagaTable.table}.${sagaTable.description} as "sagaDescription",
				${parentAdvisoryTable.table}.${parentAdvisoryTable.id} as "parentAdvisoryId",
				${parentAdvisoryTable.table}.${parentAdvisoryTable.rate} as "parentAdvisoryRate",
				${parentAdvisoryTable.table}.${parentAdvisoryTable.description} as "parentAdvisoryDescription"
				FROM ${table.table}
				INNER JOIN ${seasonTable.table} on ${table.table}.${table.seasonId} = ${seasonTable.table}.${seasonTable.id}
				INNER JOIN ${seriesTable.table} on ${seasonTable.table}.${seasonTable.seriesId} = ${seriesTable.table}.${seriesTable.id}
				INNER JOIN ${sagaTable.table} ON ${seriesTable.table}.${seriesTable.sagaId} = ${sagaTable.table}.${sagaTable.id}
				INNER JOIN ${parentAdvisoryTable.table} ON ${seriesTable.table}.${seriesTable.parentAdvisoryId} = ${parentAdvisoryTable.table}.${parentAdvisoryTable.id}
				WHERE ${result}
				ORDER BY (${seriesTable.table}.${seriesTable.id}, ${seasonTable.table}.${seasonTable.id}, ${table.table}.${table.id}) ASC`)
			})
		} else resolve(`SELECT
		${table.table}.${table.id} as "id",
		${table.table}.${table.title}  as "title", 
		${table.table}.${table.releaseDate} as "releaseDate",
		${table.table}.${table.synopsis} as "synopsis",
		${seasonTable.table}.${seasonTable.id} as "seasonId",
		${seasonTable.table}.${seasonTable.title} as "seasonTitle",
		${seasonTable.table}.${seasonTable.releaseDate} as "seasonReleaseDate",
		${seasonTable.table}.${seasonTable.synopsis} as "seasonSynopsis",
		${seriesTable.table}.${seriesTable.id} as "seriesId",
		${seriesTable.table}.${seriesTable.title} as "seriesTitle",
		${seriesTable.table}.${seriesTable.releaseDate} as "seriesReleaseDate",
		${seriesTable.table}.${seriesTable.synopsis} as "seriesSynopsis",
		${sagaTable.table}.${sagaTable.id} as "sagaId",
		${sagaTable.table}.${sagaTable.name} as "sagaName",
		${sagaTable.table}.${sagaTable.description} as "sagaDescription",
		${parentAdvisoryTable.table}.${parentAdvisoryTable.id} as "parentAdvisoryId",
		${parentAdvisoryTable.table}.${parentAdvisoryTable.rate} as "parentAdvisoryRate",
		${parentAdvisoryTable.table}.${parentAdvisoryTable.description} as "parentAdvisoryDescription"
		FROM ${table.table}
		INNER JOIN ${seasonTable.table} on ${table.table}.${table.seasonId} = ${seasonTable.table}.${seasonTable.id}
		INNER JOIN ${seriesTable.table} on ${seasonTable.table}.${seasonTable.seriesId} = ${seriesTable.table}.${seriesTable.id}
		INNER JOIN ${sagaTable.table} ON ${seriesTable.table}.${seriesTable.sagaId} = ${sagaTable.table}.${sagaTable.id}
		INNER JOIN ${parentAdvisoryTable.table} ON ${seriesTable.table}.${seriesTable.parentAdvisoryId} = ${parentAdvisoryTable.table}.${parentAdvisoryTable.id}
		ORDER BY (${seriesTable.table}.${seriesTable.id}, ${seasonTable.table}.${seasonTable.id}, ${table.table}.${table.id}) ASC`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (title, releaseDate, synopsis, seasonId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (title) {
			title = title.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.title}`
			values += `'${title}'`
			numberParameters++
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

		if (seasonId) {
			if (!isNaN(Number(seasonId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.seasonId}`
				values += `${seasonId}`
            } else reject(db.message.dataError) 
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (title, releaseDate, synopsis, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(title, releaseDate, synopsis, seasonId, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, title, releaseDate, synopsis, seasonId, callback) => {
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

		if (seasonId) {
			if (!isNaN(Number(seasonId))) {
				if (numberParameters) updateTo += ', '
				updateTo += `${table.seasonId} = ${seasonId}`
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
var CreateQueryUpdate = (id, title, releaseDate, synopsis, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, title, releaseDate, synopsis, seasonId, (error, result) => {
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

var CreateQuery = (id, title, releaseDate, synopsis, seasonId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, title, releaseDate, seasonId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(title, releaseDate, synopsis, seasonId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, title, releaseDate, synopsis, seasonId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetEpisode = (id, title, releaseDate, seasonId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, title, releaseDate, undefined, seasonId, 'get', (error, result) => {
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

var CreateEpisode = (userEmail, userPassword, title, releaseDate, synopsis, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(undefined, title, releaseDate, synopsis, seasonId, 'create', (error, result) => {
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

var UpdateEpisode = (userEmail, userPassword, id, title, releaseDate, synopsis, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, title, releaseDate, synopsis, seasonId, 'update', (error, result) => {
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

var DeleteEpisode = (userEmail, userPassword, id, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
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
  GetEpisode,
  CreateEpisode,
  UpdateEpisode,
  DeleteEpisode,
  table
}