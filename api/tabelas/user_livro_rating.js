//Handle the LivroRating(s) data with the API
var GetLivroRating = (id) => {
    return `GetLivroRating(id:${id})`
}

var CreateLivroRating = (value) => {
    console.log('CreateLivroRating')
}
var UpdateLivroRating = (id) => {
    console.log('UpdateLivroRating')
}

module.exports = {
    GetLivroRating,
    CreateLivroRating,
    UpdateLivroRating
}
