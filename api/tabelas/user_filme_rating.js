//Handle the FilmeRating(s) data with the API
var GetFilmeRating = (id) => {
    return `GetFilmeRating(id:${id})`
}

var CreateFilmeRating = (value) => {
    console.log('CreateFilmeRating')
}
var UpdateFilmeRating = (id) => {
    console.log('UpdateFilmeRating')
}

module.exports = {
    GetFilmeRating,
    CreateFilmeRating,
    UpdateFilmeRating
}
