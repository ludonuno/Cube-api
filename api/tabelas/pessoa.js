//Handle the Pessoa(s) data with the API
var GetAllPessoas = () => {
    console.log('GetAllPessoas')
}

var GetPessoa = (id) => {
    return `GetPessoa(id:${id})`
}

var CreatePessoa = () => {
    console.log('CreatePessoa')
}
var UpdatePessoa = () => {
    console.log('UpdatePessoa')
}

var DeletePessoa = () => {
    console.log('DeletePessoa')
}

module.exports = {
    GetAllPessoas,
    GetPessoa,
    CreatePessoa,
    UpdatePessoa,
    DeletePessoa
}
