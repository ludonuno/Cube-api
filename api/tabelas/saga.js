//Handle the Saga(s) data with the API
var GetAllSagas = () => {
    console.log('GetAllSagas')
}

var GetSaga = (id) => {
    return `GetSaga(id:${id})`
}

var CreateSaga = () => {
    console.log('CreateSaga')
}
var UpdateSaga = () => {
    console.log('UpdateSaga')
}

var DeleteSaga = () => {
    console.log('DeleteSaga')
}

module.exports = {
    GetAllSagas,
    GetSaga,
    CreateSaga,
    UpdateSaga,
    DeleteSaga
}
