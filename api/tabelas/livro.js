//Handle the Livro(s) data with the API

const slfj = require('./slfj.js')

var GetAllLivros = () => {
    console.log('GetAllLivros')
}

var GetLivro = (id) => {
    return `GetLivro(id:${id})`
}

var CreateLivro = () => {
    console.log('CreateLivro')
}
var UpdateLivro = () => {
    console.log('UpdateLivro')
}

var DeleteLivro = () => {
    console.log('DeleteLivro')
}

module.exports = {
    GetAllLivros,
    GetLivro,
    CreateLivro,
    UpdateLivro,
    DeleteLivro
}
