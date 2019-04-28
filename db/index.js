const { Client } = require('pg');

const client = (process.env.DATABASE_URL) ? new Client({ connectionString: process.env.DATABASE_URL, ssl: true}) : new Client({ user: 'postgres', password: 'asop3396', port: 5432, host: 'localhost', database: 'cube'})

client.connect();

module.exports = {
    query: (text, callback) => client.query(text, callback),
    message: {
        error: 'Ocorreu um problema na base de dados',
        dataNotFound: 'Não foram encontrados registos com o(s) parametro(s) pretendido(s)',
        dataFound: 'Foram encontrados registos com o(s) parametro(s) pretendido(s)'
    }
}