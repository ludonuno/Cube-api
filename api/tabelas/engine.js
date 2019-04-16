//Handle the Engine(s) data with the API
var GetAllEngines = () => {
    console.log('GetAllEngines')
}

var GetEngine = (id) => {
    return `GetEngine(id:${id})`
}

var CreateEngine = () => {
    console.log('CreateEngine')
}
var UpdateEngine = () => {
    console.log('UpdateEngine')
}

var DeleteEngine = () => {
    console.log('DeleteEngine')
}

module.exports = {
    GetAllEngines,
    GetEngine,
    CreateEngine,
    UpdateEngine,
    DeleteEngine
}
