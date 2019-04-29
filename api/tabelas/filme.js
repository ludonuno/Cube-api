//Handle the Filme(s) data with the API

const slfj = require('./slfj.js')

var GetAllFilmes = () => {
    console.log('GetAllFilmes')
}

var GetFilme = (id) => {
    return `GetFilme(id:${id})`
}

var CreateFilme = () => {
    console.log('CreateFilme')
}
var UpdateFilme = () => {
    console.log('UpdateFilme')
}

var DeleteFilme = () => {
    console.log('DeleteFilme')
}

module.exports = {
    GetAllFilmes,
    GetFilme,
    CreateFilme,
    UpdateFilme,
    DeleteFilme
}
