const db = require('./../../db')
const sizeOf = require('object-sizeof')

const { CanUserEdit } = require('./User')
const seasonTable = require('./Season').table

const table = {
    table: 'my_VideoSeason',
    id: 'id',
	link: 'link',
	seasonId: 'seasonId'
}

var HandleSelectData = (id, seasonId, callback) => {
	return new Promise((resolve, reject) => {
        let searchFor = "", numberParameters = 0
        
        if(id) {
            if (!isNaN(Number(id))) {
                searchFor += `${table.id} = ${id}`
                numberParameters++;
            } else reject(db.message.dataError)            
        }

        if (seasonId) {
			if (!isNaN(Number(seasonId))) {
				if (numberParameters) searchFor += ' AND '
                searchFor += `${table.seasonId} = ${seasonId}`
            } else reject(db.message.dataError)   
		}
		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		if (id || seasonId) {
			HandleSelectData(id, seasonId, (error, result) => {
				error 
				? reject(error) 
				: resolve(`SELECT * FROM ${table.table} INNER JOIN ${seasonTable.table} ON ${seasonTable.table}.${seasonTable.id} = ${table.table}.${table.seasonId} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${seasonTable.table} ON ${seasonTable.table}.${seasonTable.id} = ${table.table}.${table.seasonId}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (link, seasonId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (link) {
			link = link.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.link}`
			values += `'${link}'`
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
var CreateQueryInsert = (link, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(link, seasonId, (error, result) => {
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

var CreateQuery = (id, link, seasonId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, seasonId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(link, seasonId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetVideoSeason = (id, seasonId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, undefined, seasonId, 'get', (error, result) => {
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

var CreateVideoSeason = (userEmail, userPassword, link, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(undefined, link, seasonId, 'create', (error, result) => {
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

var DeleteVideoSeason = (userEmail, userPassword, id, callback) => {
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
  GetVideoSeason,
  CreateVideoSeason,
  DeleteVideoSeason,
  table
}