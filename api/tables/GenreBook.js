const db = require('./../../db')
const sizeOf = require('object-sizeof')

const bookTable = require('./Book').table
const genresTable = require('./Genres').table

const { CanUserEdit } = require('./User')

const table = {
    table: 'my_GenreBook',
    bookId: 'bookId',
    genreId: 'genreId'
}

var HandleSelectData = (bookId, genreId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = "", searchFor = "", numberParameters = 0

        if(bookId) {
            if (!isNaN(Number(bookId))) {
				fields = `${genresTable.table}.${genresTable.id}, ${genresTable.table}.${genresTable.genre}`
				searchFor += `${table.bookId} = ${bookId}`
                numberParameters++;
            } else reject(db.message.dataError)            
		}
		
		if(genreId) {
            if (!isNaN(Number(genreId))) {
				fields = `${bookTable.table}.${bookTable.id}, ${bookTable.table}.${bookTable.title}, ${bookTable.table}.${bookTable.releaseDate}, ${bookTable.table}.${bookTable.synopsis}, ${bookTable.table}.${bookTable.publishingCompanyId}, ${bookTable.table}.${bookTable.sagaId}`
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

var CreateQuerySelect = (bookId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		//Se eu meter o bookId devolve todas as companies que desenvolvedoram o game
		//Se eu meter o genreId devolve todos os jogos que foram desenvolvidos pela company
		//Se eu meter os bookId e genreId devole o jogo que foi desenvolvido pela company
		if (bookId || genreId) {
			HandleSelectData(bookId, genreId, (error, result) => {
				error ? reject(error) : resolve(`SELECT ${result.fields} FROM ${table.table} INNER JOIN ${bookTable.table} ON ${bookTable.table}.${bookTable.id} = ${table.bookId} INNER JOIN ${genresTable.table} ON ${genresTable.table}.${genresTable.id} = ${table.genreId}  WHERE ${result.searchFor} ORDER BY (${table.bookId}, ${table.genreId})`)
			})
		} else resolve(`SELECT * FROM ${table.table} INNER JOIN ${bookTable.table} ON ${bookTable.table}.${bookTable.id} = ${table.bookId} INNER JOIN ${genresTable.table} ON ${genresTable.table}.${genresTable.id} = ${table.genreId} ORDER BY (${table.bookId}, ${table.genreId})`)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (bookId, genreId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (bookId) {
			if (!isNaN(Number(bookId))) {
				fields += `${table.bookId}`
				values += `${bookId}`
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
var CreateQueryInsert = (bookId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(bookId, genreId, (error, result) => {
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
var CreateQueryDelete = (bookId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		(!isNaN(Number(bookId)) && !isNaN(Number(genreId)))
		? resolve(`DELETE FROM ${table.table} WHERE ${table.bookId} = ${bookId} AND ${table.genreId} = ${genreId} RETURNING *`) 
		: reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = (bookId, genreId, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(bookId, genreId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(bookId, genreId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'delete':
                CreateQueryDelete(bookId, genreId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetGenreBook = (bookId, genreId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(bookId, genreId, 'get', (error, result) => {
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

var CreateGenreBook = (userEmail, userPassword, bookId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(bookId, genreId, 'create', (error, result) => {
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

var DeleteGenreBook = (userEmail, userPassword, bookId, genreId, callback) => {
	return new Promise((resolve, reject) => {
		CanUserEdit(userEmail, userPassword, (error, result) => {
			if (error) reject(error)
			else if(result) {
				CreateQuery(bookId, genreId, 'delete', (error, result) => {
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
  GetGenreBook,
  CreateGenreBook,
  DeleteGenreBook,
  table
}