const db = require('./../../db')
const sizeOf = require('object-sizeof')

const { CanUserEdit } = require('./User')
const episodeTable = require('./Episode').table

const table = {
    table: 'my_VideoEpisode',
    id: 'id',
	link: 'link',
	episodeId: 'episodeId'
}

var HandleSelectData = (id, episodeId, callback) => {
	return new Promise((resolve, reject) => {
        let searchFor = "", numberParameters = 0
        
        if(id) {
            if (!isNaN(Number(id))) {
                searchFor += `${table.id} = ${id}`
                numberParameters++;
            } else reject(db.message.dataError)            
        }

        if (episodeId) {
			if (!isNaN(Number(episodeId))) {
				if (numberParameters) searchFor += ' AND '
                searchFor += `${table.episodeId} = ${episodeId}`
            } else reject(db.message.dataError)   
		}
		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, episodeId, callback) => {
	return new Promise((resolve, reject) => {
		if (id || episodeId) {
			HandleSelectData(id, episodeId, (error, result) => {
				error 
				? reject(error) 
				: resolve(`SELECT * FROM ${table.table} WHERE ${result}`)
			})
		} else resolve(`SELECT ${table.table}.${table.id}, ${table.table}.${table.link}, ${table.table}.${table.episodeId}, ${episodeTable.table}.${episodeTable.title}, ${episodeTable.table}.${episodeTable.releaseDate}, ${episodeTable.table}.${episodeTable.synopsis}, ${episodeTable.table}.${episodeTable.duration}, ${episodeTable.table}.${episodeTable.parentAdvisoryId}, ${episodeTable.table}.${episodeTable.sagaId} FROM ${table.table} INNER JOIN ${episodeTable.table} ON ${episodeTable.table}.${episodeTable.id}=${table.table}.${table.episodeId}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (link, episodeId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (link) {
			link = link.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.link}`
			values += `'${link}'`
			numberParameters++
		}

		if (episodeId) {
			if (!isNaN(Number(episodeId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.episodeId}`
				values += `${episodeId}`
			} else reject(db.message.dataError)
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (link, episodeId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(link, episodeId, (error, result) => {
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
var CreateQueryDelete = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${table.table} WHERE ${table.id} = ${id} RETURNING *`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (id, link, episodeId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, episodeId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(link, episodeId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetVideoEpisode = (id, episodeId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, undefined, episodeId, 'get', (error, result) => {
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

var CreateVideoEpisode = (userEmail, userPassword, link, episodeId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(undefined, link, episodeId, 'create', (error, result) => {
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

var DeleteVideoEpisode = (userEmail, userPassword, id, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(id, undefined, undefined, 'delete', (error, result) => {
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
  GetVideoEpisode,
  CreateVideoEpisode,
  DeleteVideoEpisode,
  table
}