const db = require('./../../db')
const sizeOf = require('object-sizeof')

const gameTable = require('./Game').table
const companyTable = require('./Company').table

const table = {
    table: 'my_Developers',
    gameId: 'gameId',
    companyId: 'companyId'
}

var HandleSelectData = (gameId, companyId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(gameId) {
            if (!isNaN(Number(gameId))) {
				fields = `${companyTable.table}.${companyTable.id}, ${companyTable.table}.${companyTable.name}`
				searchFor += `${table.gameId} = ${gameId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(companyId) {
            if (!isNaN(Number(companyId))) {
				fields = `${gameTable.table}.${gameTable.id}, ${gameTable.table}.${gameTable.title}, ${gameTable.table}.${gameTable.photo}, ${gameTable.table}.${gameTable.releaseDate}, ${gameTable.table}.${gameTable.synopsis}, ${gameTable.table}.${gameTable.engineId}, ${gameTable.table}.${gameTable.parentAdvisoryId}, ${gameTable.table}.${gameTable.publicadorId}, ${gameTable.table}.${gameTable.sagaId}`
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.companyId} = ${companyId}`
            } else reject(db.message.dataError)            
		}
		resolve({fields, searchFor})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (gameId, companyId, callback) => {
	return new Promise((resolve, reject) => {
		if (gameId || companyId) {
			HandleSelectData(gameId, companyId, (error, result) => {
				error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${gameTable.table} ON ${gameTable.table}.${gameTable.id} = ${table.gameId} INNER JOIN ${companyTable.table} ON ${companyTable.table}.${companyTable.id} = ${table.companyId}  WHERE ${result.searchFor} ORDER BY (${table.gameId}, ${table.companyId})`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${gameTable.table} ON ${gameTable.table}.${gameTable.id} = ${table.gameId} INNER JOIN ${companyTable.table} ON ${companyTable.table}.${companyTable.id} = ${table.companyId} ORDER BY (${table.gameId}, ${table.companyId})`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (gameId, companyId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (gameId) {
			if (!isNaN(Number(gameId))) {
				fields += `${table.gameId}`
				values += `${gameId}`
				numberParameters++
			}
		}

		if (companyId) {
			if (!isNaN(Number(companyId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.companyId}`
				values += `${companyId}`
			}
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (gameId, companyId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(gameId, companyId, (error, result) => {
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
var CreateQueryDelete = (gameId, companyId, callback) => {
	return new Promise((resolve, reject) => {
		(!isNaN(Number(gameId)) && !isNaN(Number(companyId)))
		? resolve(`DELETE FROM ${table.table} WHERE ${table.gameId} = ${gameId} AND ${table.companyId} = ${companyId} RETURNING *`) 
		: reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (gameId, companyId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(gameId, companyId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(gameId, companyId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(gameId, companyId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetDevelopers = (gameId, companyId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(gameId, companyId, 'get', (error, result) => {
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

var CreateDevelopers = (gameId, companyId, callback) => {
	return new Promise((resolve, reject) => {
        CreateQuery(gameId, companyId, 'create', (error, result) => {
            error ? reject(error) : db.query(result, (error, result) => {
                error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
            })
        })
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteDevelopers = (gameId, companyId, callback) => {
	return new Promise((resolve, reject) => {
		GetDevelopers(gameId, companyId, (error, result) => {
			error ? reject(error) :	CreateQuery(gameId, companyId, 'delete', (error, result) => {
				error ? reject(error) : db.query(result, (error, result) => {
					error ? reject(db.message.internalError) : resolve({message: db.message.successfulDelete, data: result}) 
				})
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

module.exports = {
  GetDevelopers,
  CreateDevelopers,
  DeleteDevelopers,
  table
}