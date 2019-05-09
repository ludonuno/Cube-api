const db = require('../../db')
const sizeOf = require('object-sizeof')

const table = {
    table: 'my_Episode',
    id: 'id',
	title: 'title',
	photo: 'photo',
	releaseDate: 'releaseDate',
	synopsis: 'synopsis',
	seasonId: 'seasonId'
}

var HandleSelectData = (id, title, releaseDate, seasonId, callback) => {
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

		if (seasonId) {
			if (!isNaN(Number(seasonId))) {
				if (numberParameters) searchFor += ' AND '
				searchFor += `${table.seasonId} = ${seasonId}`
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
				error ? reject(error) : resolve(`SELECT * FROM ${table.table} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${table.table}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (title, photo, releaseDate, synopsis, seasonId, callback) => {
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
			fields += `${table.description}`
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
			fields += `${table.description}`
			values += `'${synopsis}'`
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
var CreateQueryInsert = (title, photo, releaseDate, synopsis, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(title, photo, releaseDate, synopsis, seasonId, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values}) RETURNING *`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, title, photo, releaseDate, synopsis, seasonId, callback) => {
	return new Promise((resolve, reject) => {
        let updateTo = '', numberParameters = 0
		
		if (isNaN(Number(id))) reject(db.message.dataError)
		
		if (title) {
			title = title.replace("'", '%27')
			updateTo += `${table.title} = '${title}'`
			numberParameters++;
		}

		if (photo) {
			if (numberParameters) updateTo += ' AND '
			updateTo += `${table.description} = decode('${photo}', 'hex')`
			numberParameters++
		}

		if (releaseDate) {
			if (numberParameters) updateTo += ' AND '
			updateTo += `${table.releaseDate} = '${releaseDate}'`
			numberParameters++
		}

		if (synopsis) {
			if (numberParameters) updateTo += ' AND '
			synopsis = synopsis.replace("'", '%27')
			updateTo += `${table.description} = '${synopsis}'`
			numberParameters++
		}

		if (seasonId) {
			if (!isNaN(Number(seasonId))) {
				if (numberParameters) updateTo += ' AND '
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
var CreateQueryUpdate = (id, title, photo, releaseDate, synopsis, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, title, photo, releaseDate, synopsis, seasonId, (error, result) => {
			error 
			? reject(db.message.dataError) 
			: resolve(`UPDATE ${table.table} SET ${result}' WHERE ${table.id} = ${id} RETURNING *`)
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

var CreateQuery = (id, title, photo, releaseDate, synopsis, seasonId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, title, releaseDate, seasonId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(title, photo, releaseDate, synopsis, seasonId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, title, photo, releaseDate, synopsis, seasonId, (error, result) => error ? reject(error) : resolve(result) )
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
		CreateQuery(id, title, undefined, releaseDate, undefined, seasonId, 'get', (error, result) => {
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

var CreateEpisode = (title, photo, releaseDate, synopsis, seasonId, callback) => {
	return new Promise((resolve, reject) => {
        CreateQuery(undefined, title, photo, releaseDate, synopsis, seasonId, 'create', (error, result) => {
            error ? reject(error) : db.query(result, (error, result) => {
                error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
            })
        })
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var UpdateEpisode = (id, title, photo, releaseDate, synopsis, seasonId, callback) => {
	return new Promise((resolve, reject) => {
		GetEpisode(id, undefined, undefined, undefined, undefined, (error, result) => {
			error ? reject(error) :	CreateQuery(id, title, photo, releaseDate, synopsis, seasonId, 'update', (error, result) => {
				error ? reject(error) : db.query(result, (error, result) => {
					error ? reject(db.message.internalError) : resolve({message: db.message.successfulUpdate, data: result}) 
				})
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteEpisode = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetEpisode(id, undefined, undefined, undefined, undefined, (error, result) => {
			error ? reject(error) :	CreateQuery(id, undefined, undefined, undefined, undefined, undefined, undefined, 'delete', (error, result) => {
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
  GetEpisode,
  CreateEpisode,
  UpdateEpisode,
  DeleteEpisode,
  table
}