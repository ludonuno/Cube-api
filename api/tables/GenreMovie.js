const db = require('./../../db')
const sizeOf = require('object-sizeof')

const movieTable = require('./Movie').table
const genresTable = require('./Genres').table

const table = {
    table: 'my_GenreMovie',
    movieId: 'movieId',
    genreId: 'genreId'
}

var HandleSelectData = (movieId, genreId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(movieId) {
            if (!isNaN(Number(movieId))) {
				fields = `${genresTable.table}.${genresTable.id}, ${genresTable.table}.${genresTable.genre}`
				searchFor += `${table.movieId} = ${movieId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(genreId) {
            if (!isNaN(Number(genreId))) {
				fields = `${movieTable.table}.${movieTable.id}, ${movieTable.table}.${movieTable.title}, ${movieTable.table}.${movieTable.photo}, ${movieTable.table}.${movieTable.releaseDate}, ${movieTable.table}.${movieTable.synopsis}, ${movieTable.table}.${movieTable.duration}, ${movieTable.table}.${movieTable.parentAdvisoryId}, ${movieTable.table}.${movieTable.sagaId}`
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

var CreateQuerySelect = (movieId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		if (movieId || genreId) {
			HandleSelectData(movieId, genreId, (error, result) => {
				error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${movieTable.table} ON ${movieTable.table}.${movieTable.id} = ${table.movieId} INNER JOIN ${genresTable.table} ON ${genresTable.table}.${genresTable.id} = ${table.genreId}  WHERE ${result.searchFor} ORDER BY (${table.movieId}, ${table.genreId})`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${movieTable.table} ON ${movieTable.table}.${movieTable.id} = ${table.movieId} INNER JOIN ${genresTable.table} ON ${genresTable.table}.${genresTable.id} = ${table.genreId} ORDER BY (${table.movieId}, ${table.genreId})`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (movieId, genreId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (movieId) {
			if (!isNaN(Number(movieId))) {
				fields += `${table.movieId}`
				values += `${movieId}`
				numberParameters++
			}
		}

		if (genreId) {
			if (!isNaN(Number(genreId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.genreId}`
				values += `${genreId}`
			}
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (movieId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(movieId, genreId, (error, result) => {
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
var CreateQueryDelete = (movieId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		(!isNaN(Number(movieId)) && !isNaN(Number(genreId)))
		? resolve(`DELETE FROM ${table.table} WHERE ${table.movieId} = ${movieId} AND ${table.genreId} = ${genreId} RETURNING *`) 
		: reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (movieId, genreId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(movieId, genreId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(movieId, genreId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(movieId, genreId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetGenreMovie = (movieId, genreId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(movieId, genreId, 'get', (error, result) => {
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

var CreateGenreMovie = (movieId, genreId, callback) => {
	return new Promise((resolve, reject) => {
        CreateQuery(movieId, genreId, 'create', (error, result) => {
            error ? reject(error) : db.query(result, (error, result) => {
                error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
            })
        })
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteGenreMovie = (movieId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		GetGenreMovie(movieId, genreId, (error, result) => {
			error ? reject(error) :	CreateQuery(movieId, genreId, 'delete', (error, result) => {
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
  GetGenreMovie,
  CreateGenreMovie,
  DeleteGenreMovie,
  table
}