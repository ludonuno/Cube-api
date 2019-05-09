const db = require('./../../db')
const sizeOf = require('object-sizeof')

const table = {
    table: 'my_MovieGallery',
    id: 'id',
	photo: 'photo',
	movieId: 'movieId'
}

var HandleSelectData = (id, movieId, callback) => {
	return new Promise((resolve, reject) => {
        let searchFor = "", numberParameters = 0
        
        if(id) {
            if (!isNaN(Number(id))) {
                searchFor += `${table.id} = ${id}`
                numberParameters++;
            } else reject(db.message.dataError)            
        }

        if (movieId) {
			if (!isNaN(Number(movieId))) {
				if (numberParameters) searchFor += ' AND '
                searchFor += `${table.movieId} = ${movieId}`
            } else reject(db.message.dataError)   
		}
		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, movieId, callback) => {
	return new Promise((resolve, reject) => {
		if (id || movieId) {
			HandleSelectData(id, movieId, (error, result) => {
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

var HandleInsertData = (photo, movieId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (photo) {
			fields += `${table.photo}`
			values += `decode('${photo}', 'hex')`
			numberParameters++
		}

		if (movieId) {
			if (!isNaN(Number(movieId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.movieId}`
				values += `${movieId}`
			}
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (photo, movieId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(photo, movieId, (error, result) => {
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

var CreateQuery = (id, photo, movieId, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, movieId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(photo, movieId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetMovieGallery = (id, movieId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, undefined, movieId, 'get', (error, result) => {
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

var CreateMovieGallery = (photo, movieId, callback) => {
	return new Promise((resolve, reject) => {
        CreateQuery(undefined, photo, movieId, 'create', (error, result) => {
            error ? reject(error) : db.query(result, (error, result) => {
                error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
            })
        })
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteMovieGallery = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetMovieGallery(id, undefined, (error, result) => {
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
  GetMovieGallery,
  CreateMovieGallery,
  DeleteMovieGallery,
  table
}