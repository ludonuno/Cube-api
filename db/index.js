const { Pool } = require('pg')

const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: true }) : new Pool({ user: 'postgres', password: 'asop3396', port: 5432, host: 'localhost', database: 'cube'})

query = (text, callback) => {
	return new Promise((resolve, reject) => {
		pool.query(text, (err, res) => err ? reject(err) : resolve(res.rows) )
	}).then(
		resolve => callback(undefined, resolve),
		reject => callback(reject, undefined)
	)
}

module.exports = {
	query,
	message: {
		internalError:'"Ocorreu um problema na base de dados.',
		dataNotFound: 'Não foram encontrados registos com o(s) parametro(s) pretendido(s).',
		dataFound: 'Foram encontrados registos com o(s) parametro(s) pretendido(s).',
		dataError: 'Os tipos de dados não são válidos.',
		successfulCreate : 'Registo criado com sucesso.',
		successfulUpdate : 'Registo atualizado com sucesso.',
		successfulDelete : 'Registo apagado com sucesso.'
	}
}
