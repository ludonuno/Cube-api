const db = require('./../../db')
const sizeOf = require('object-sizeof')

const table = {
    table: 'my_SeriesGallery',
    id: 'id',
	photo: 'photo',
	seriesId: 'seriesId'
}

var HandleSelectData = (id, seriesId, callback) => {
	return new Promise((resolve, reject) => {
        let searchFor = "", numberParameters = 0
        
        if(id) {
            if (!isNaN(Number(id))) {
                searchFor += `${table.id} = ${id}`
                numberParameters++;
            } else reject(db.message.dataError)            
        }

        if (seriesId) {
			if (!isNaN(Number(seriesId))) {
				if (numberParameters) searchFor += ' AND '
                searchFor += `${table.seriesId} = ${seriesId}`
            } else reject(db.message.dataError)   
		}
		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, seriesId, callback) => {
	return new Promise((resolve, reject) => {
		if (id || seriesId) {
			HandleSelectData(id, seriesId, (error, result) => {
				error 
				? reject(error) 
				: resolve(`SELECT * FROM ${table.table} WHERE ${result}`)
			})
		} else resolve(`SELECT * FROM ${table.table}`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (photo, seriesId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (photo) {
			fields += `${table.photo}`
			values += `decode('${photo}', 'hex')`
			numberParameters++
		}

		if (seriesId) {
			if (!isNaN(Number(seriesId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.seriesId}`
				values += `${seriesId}`
			}
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (photo, seriesId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(photo, seriesId, (error, result) => {
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

var CreateQuery = (id, photo, seriesId, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, seriesId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(photo, seriesId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetSeriesGallery = (id, seriesId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, undefined, seriesId, 'get', (error, result) => {
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

var CreateSeriesGallery = (photo, seriesId, callback) => {
	return new Promise((resolve, reject) => {
        CreateQuery(undefined, photo, seriesId, 'create', (error, result) => {
            error ? reject(error) : db.query(result, (error, result) => {
                error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
            })
        })
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteSeriesGallery = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetSeriesGallery(id, undefined, (error, result) => {
			error ? reject(error) :	CreateQuery(id, undefined, undefined, 'delete', (error, result) => {
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
  GetSeriesGallery,
  CreateSeriesGallery,
  DeleteSeriesGallery,
  table
}