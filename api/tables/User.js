const bcrypt = require('bcrypt')

const db = require('../../db')
const sizeOf = require('object-sizeof')

const saltRounds = 10
const table = {
    table: 'my_User',
    id: 'id',
	name: 'name',
	password: 'password',
	email: 'email',
	birthday: 'birthday',
	description: 'description',
	creationDate: 'creationDate',
	canEdit: 'canEdit',
	isSystemAdmin: 'isSystemAdmin'
}

var UserAutentication = (email, password, callback) => {
	return new Promise((resolve,reject) => {
		if(email && password) {
			let fields = `${table.id}, ${table.name}, ${table.password}, ${table.email}, ${table.birthday}, ${table.description}, ${table.creationDate}`
			let query = `SELECT ${fields} FROM ${table.table} WHERE ${table.email} = '${email}'`
			db.query(query, (error, result) => {
				if (error) reject(db.message.internalError)
				else if (sizeOf(result)) {
					bcrypt.compare(password, result[0].password).then(res => {
						if(res) resolve(result)
						else if(password == result[0].password) resolve(result)// é enviado o hash
						else reject('Autenticação inválida')
					})
				} else reject(db.message.dataNotFound)
			})
		} else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CanUserEdit = (email, password, callback) => {
	return new Promise((resolve, reject) => {
		if(email && password) {
			let query = `SELECT * FROM ${table.table} WHERE ${table.email} = '${email}'`
			db.query(query, (error, result) => {
				error 
				? reject(db.message.internalError) 
				: bcrypt.compare(password, result[0].password).then(res => {
					if(res) resolve(result[0].canedit)
					else if(password == result[0].password) resolve(result[0].canedit)// é enviado o hash
					else reject('Autenticação inválida')
				})
			})
		} else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var IsUserSystemAdmin = (email, password, callback) => {
	return new Promise((resolve, reject) => {
		if(email && password) {
			let query = `SELECT * FROM ${table.table} WHERE ${table.email} = '${email}'`
			db.query(query, (error, result) => {
				error 
				? reject(db.message.internalError) 
				: bcrypt.compare(password, result[0].password).then(res => {
					if(res) resolve(result[0].issystemadmin)
					else if(password == result[0].password) resolve(result[0].issystemadmin)// é enviado o hash
					else reject('Autenticação inválida')
				})
			})
		} else reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleSelectData = (id, callback) => {
	return new Promise((resolve, reject) => {
		
		if(id) {
            if (!isNaN(Number(id))) {
				resolve(`${table.id} = ${id}`)
            } else reject(db.message.dataError)            
		}
		
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CheckForUnregularData = (id, name, password, email, birthday, description, callback) => {
	return new Promise((resolve, reject) => {
		if (id && (id.toLowerCase().includes("canedit") || id.toLowerCase().includes("issystemadmin"))) reject(true)
		if (name && (name.toLowerCase().includes("canedit") || name.toLowerCase().includes("issystemadmin"))) reject(true)
		if (password && (password.toLowerCase().includes("canedit") || password.toLowerCase().includes("issystemadmin"))) reject(true)
		if (email && (email.toLowerCase().includes("canedit") || email.toLowerCase().includes("issystemadmin"))) reject(true)
		if (birthday && (birthday.toLowerCase().includes("canedit") || birthday.toLowerCase().includes("issystemadmin"))) reject(true)
		if (description && (description.toLowerCase().includes("canedit") || description.toLowerCase().includes("issystemadmin"))) reject(true)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuerySelect = (id, callback) => {
	return new Promise((resolve, reject) => {
		HandleSelectData(id, (error, result) => {
			fields = `${table.id}, ${table.name}, ${table.birthday}, ${table.description}, ${table.creationDate}`
			error ? reject(error) : resolve(`SELECT ${fields} FROM ${table.table} WHERE ${result}`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleInsertData = (name, password, email, birthday, description, callback) => {
	return new Promise((resolve, reject) => {
        let fields = '', values = '', numberParameters = 0

		if (name) {
			name = name.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.name}`
			values += `'${name}'`
			numberParameters++;
		}

		if (password) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			fields += `${table.password}`
			values += `'${bcrypt.hashSync(password, saltRounds)}'`
			numberParameters++
		}

		if (email) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			email = email.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.email}`
			values += `'${email}'`
			numberParameters++
		}

		if (birthday) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			birthday = birthday.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.birthday}`
			values += `'${birthday}'`
			numberParameters++
		}

		if (description) {
			if (numberParameters) {
				fields += ', '
				values += ', '
			}
			description = description.replace( new RegExp("'", 'g') , '%27')
			fields += `${table.description}`
			values += `'${description}'`
		}

		resolve({fields, values})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Create and return the record created
var CreateQueryInsert = (name, password, email, birthday, description, callback) => {
	return new Promise((resolve, reject) => {
		HandleInsertData(name, password, email, birthday, description, (error, result) => {
			error 
			? reject(error) 
			: resolve(`INSERT INTO ${table.table} (${result.fields}) VALUES (${result.values})`)
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var HandleUpdateData = (id, name, password, email, birthday, description, canEdit, callback) => {
	return new Promise((resolve, reject) => {
        let updateTo = '', numberParameters = 0
		
		if (isNaN(Number(id))) reject(db.message.dataError)
		
		if (name) {
			name = name.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.name} = '${name}'`
			numberParameters++;
		}

		if (password) {
			if (numberParameters) updateTo += ', '
			updateTo += `${table.password} = '${bcrypt.hashSync(password, saltRounds)}'`
			numberParameters++
		}

		if (email) {
			if (numberParameters) updateTo += ', '
			email = email.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.email} = '${email}'`
			numberParameters++
		}

		if (birthday) {
			if (numberParameters) updateTo += ', '
			birthday = birthday.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.birthday} = '${birthday}'`
			numberParameters++
		}

		if (description) {
			if (numberParameters) updateTo += ', '
			description = description.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.description} = '${description}'`
			numberParameters++
		}

		if (canEdit) {
			if (numberParameters) updateTo += ', '
			canEdit = canEdit.replace( new RegExp("'", 'g') , '%27')
			updateTo += `${table.canEdit} = ${canEdit}`
			numberParameters++
		}

		resolve(updateTo)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Update an existing record and return the value updated
var CreateQueryUpdate = (id, name, password, email, birthday, description, canEdit, callback) => {
	return new Promise((resolve, reject) => {
		HandleUpdateData(id, name, password, email, birthday, description, canEdit, (error, result) => {
			error 
			? reject(db.message.dataError) 
			: resolve(`UPDATE ${table.table} SET ${result} WHERE ${table.id} = ${id}`)
		})
		
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

//Delete an existing record and return the value deleted
var CreateQueryDelete = (id, callback) => {
	return new Promise((resolve, reject) => {
		!isNaN(Number(id)) ? resolve(`DELETE FROM ${table.table} WHERE ${table.id} = ${id}`) : reject(db.message.dataError)
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var CreateQuery = ( id, name, password, email, birthday, description, canEdit, action, callback) => {
  	return new Promise ((resolve, reject) => {
		switch (action) {
			case 'get': 
				CreateQuerySelect(id, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'create': 
                CreateQueryInsert(name, password, email, birthday, description, (error, result) => error ? reject(error) : resolve(result) )
				break;
			case 'update':
                CreateQueryUpdate(id, name, password, email, birthday, description, canEdit , (error, result) => error ? reject(error) : resolve(result) )
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
var GetUser = (emailUser, userPassword, id, callback) => {
  	return new Promise((resolve, reject) => {
		UserAutentication(emailUser, userPassword, (error, result) => {
			if (error) reject(error)
			else {
				CreateQuery( id, undefined, undefined, undefined, undefined, undefined, undefined, 'get', (error, result) => {
					error ? reject(error) :	db.query(result, (error, result) => {
						if (error) reject(db.message.internalError)
						else if (!sizeOf(result)) reject(db.message.dataNotFound)
						else resolve(result)
					})
				})
			}
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}		

var CreateUser = (name, password, email, birthday, description, callback) => {
	return new Promise((resolve, reject) => {
		CreateQuery(undefined, name, password, email, birthday, description, undefined, 'create', (error, result) => {
			error ? reject(error) : db.query(result, (error, result) => {
				error ? reject(db.message.internalError) : resolve({message: db.message.successfulCreate})
			})
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

var UpdateUser = (emailUser, userPassword, id, name, password, email, birthday, description, canEdit, callback) => {
	return new Promise((resolve, reject) => {
		UserAutentication(emailUser, userPassword, (error, result) => {
			if (error) reject(error)
			else {
				if(result[0].id == id) {
					CreateQuery(id, name, password, email, birthday, description, undefined, 'update', (error, result) => {
						error ? reject(error) : CheckForUnregularData( id, name, password, email, birthday, description, (error) => {
							error ? reject('Tentativa de violação dos dados sem sucesso') : db.query(result, (error, result) => {
								error ? reject(db.message.internalError) : resolve({message: db.message.successfulUpdate}) 
							})
						})					
					})
				} else {
					IsUserSystemAdmin(emailUser, userPassword, (error, result) => {
						if (error) reject(error)
						else if(result) {
							CreateQuery(id, name, password, email, birthday, description, canEdit, 'update', (error, result) => {
								error ? reject(error) : db.query(result, (error, result) => {
									error ? reject(db.message.internalError) : resolve({message: db.message.successfulUpdate}) 
								})
							})
						} else reject('Não tem permissões para esta ação')
					})		
				}
			}
		})
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

module.exports = {
  GetUser,
  CreateUser,
  UpdateUser,
  UserAutentication,
  CanUserEdit,
  table
}