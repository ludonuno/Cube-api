//Handle the Serie(s) data with the API

const slfj = require('./slfj.js')

var GetSerie = (id) => {
    return `GetSerie(id:${id})`
}

var CreateSerie = () => {
    console.log('CreateSerie')
}
var UpdateSerie = () => {
    console.log('UpdateSerie')
}

var DeleteSerie = () => {
    console.log('DeleteSerie')
}

module.exports = {
    GetSerie,
    CreateSerie,
    UpdateSerie,
    DeleteSerie
}
