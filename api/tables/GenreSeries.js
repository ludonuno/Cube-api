const db = require('./../../db')
const sizeOf = require('object-sizeof')

const seriesTable = require('./Game').table
const genresTable = require('./Genres').table

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_GenreSeries',
    seriesId: 'seriesId',
    genreId: 'genreId'
}

var HandleSelectData = (seriesId, genreId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(seriesId) {
            if (!isNaN(Number(seriesId))) {
				fields = `${genresTable.table}.${genresTable.id}, ${genresTable.table}.${genresTable.genre}`
				searchFor += `${table.seriesId} = ${seriesId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(genreId) {
            if (!isNaN(Number(genreId))) {
				fields = `${seriesTable.table}.${seriesTable.id}, ${seriesTable.table}.${seriesTable.title}, ${seriesTable.table}.${seriesTable.releaseDate}, ${seriesTable.table}.${seriesTable.synopsis}, ${seriesTable.table}.${seriesTable.parentAdvisoryId}, ${seriesTable.table}.${seriesTable.sagaId}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.genreId} = ${genreId}`
            } else reject(db.message.dataError)            
		}
		resolve({fields, searchFor})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (seriesId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		if (seriesId || genreId) {
			HandleSelectData(seriesId, genreId, (error, result) => {
				error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${seriesTable.table} ON ${seriesTable.table}.${seriesTable.id} = ${table.seriesId} INNER JOIN ${genresTable.table} ON ${genresTable.table}.${genresTable.id} = ${table.genreId}  WHERE ${result.searchFor} ORDER BY (${table.seriesId}, ${table.genreId})`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${seriesTable.table} ON ${seriesTable.table}.${seriesTable.id} = ${table.seriesId} INNER JOIN ${genresTable.table} ON ${genresTable.table}.${genresTable.id} = ${table.genreId} ORDER BY (${table.seriesId}, ${table.genreId})`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (seriesId, genreId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (seriesId) {
			if (!isNaN(Number(seriesId))) {
				fields += `${table.seriesId}`
				values += `${seriesId}`
				numberParameters++
			} else reject(db.message.dataError)
		}

		if (genreId) {
			if (!isNaN(Number(genreId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.genreId}`
				values += `${genreId}`
			} else reject(db.message.dataError)
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (seriesId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(seriesId, genreId, (error, result) => {
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
var CreateQueryDelete = (seriesId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		(!isNaN(Number(seriesId)) && !isNaN(Number(genreId)))
		? resolve(`DELETE FROM ${table.table} WHERE ${table.seriesId} = ${seriesId} AND ${table.genreId} = ${genreId} RETURNING *`) 
		: reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (seriesId, genreId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(seriesId, genreId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(seriesId, genreId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(seriesId, genreId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetGenreSeries = (seriesId, genreId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(seriesId, genreId, 'get', (error, result) => {
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

var CreateGenreSeries = (userEmail, userPassword, seriesId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		GetGenreSeries(seriesId, genreId, (error, result) => {
			if(error == db.message.dataNotFound) {
				CanUserEdit(userEmail, userPassword, (error, result) => {
					if (error) reject(error)
					else if(result) {
						CreateQuery(seriesId, genreId, 'create', (error, result) => {
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

var DeleteGenreSeries = (userEmail, userPassword, seriesId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(seriesId, genreId, 'delete', (error, result) => {
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
  GetGenreSeries,
  CreateGenreSeries,
  DeleteGenreSeries,
  table
}