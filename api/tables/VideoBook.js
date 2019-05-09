const db = require('./../../db')
const sizeOf = require('object-sizeof')

const table = {
    table: 'my_VideoBook',
    id: 'id',
	link: 'link',
	bookId: 'bookId'
}

var HandleSelectData = (id, bookId, callback) => {
	return new Promise((resolve, reject) => {
        let searchFor = "", numberParameters = 0
        
        if(id) {
            if (!isNaN(Number(id))) {
                searchFor += `${table.id} = ${id}`
                numberParameters++;
            } else reject(db.message.dataError)            
        }

        if (bookId) {
			if (!isNaN(Number(bookId))) {
				if (numberParameters) searchFor += ' AND '
                searchFor += `${table.bookId} = ${bookId}`
            } else reject(db.message.dataError)   
		}
		resolve(searchFor)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, bookId, callback) => {
	return new Promise((resolve, reject) => {
		if (id || bookId) {
			HandleSelectData(id, bookId, (error, result) => {
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

var HandleInsertData = (link, bookId, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (link) {
			fields += `${table.link}`
			values += `'${link}'`
			numberParameters++
		}

		if (bookId) {
			if (!isNaN(Number(bookId))) {
				if (numberParameters) {
					fields += ', '
					values += ', '
				}
				fields += `${table.bookId}`
				values += `${bookId}`
			}
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (link, bookId, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(link, bookId, (error, result) => {
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

var CreateQuery = (id, link, bookId, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, bookId, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(link, bookId, (error, result) => error ? reject(error) : resolve(result) )
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
var GetVideoBook = (id, bookId, callback) => {
  	return new Promise((resolve, reject) => {
		CreateQuery(id, undefined, bookId, 'get', (error, result) => {
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

var CreateVideoBook = (link, bookId, callback) => {
	return new Promise((resolve, reject) => {
        CreateQuery(undefined, link, bookId, 'create', (error, result) => {
            error ? reject(error) : db.query(result, (error, result) => {
                error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate, data: result})
            })
        })
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var DeleteVideoBook = (id, callback) => {
	return new Promise((resolve, reject) => {
		GetVideoBook(id, undefined, (error, result) => {
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
  GetVideoBook,
  CreateVideoBook,
  DeleteVideoBook,
  table
}