// Este ficheiro, api.js tem a função de executar request à base de dados.
// última edição : 05-04-2019 11:45PM
const users = require('./users/users.js')
//const pessoas = require('./users/users.js')

var ApiErrorMessage = () => {
    return 'Page not found'
}

module.exports = {
    users,
    ApiErrorMessage
}