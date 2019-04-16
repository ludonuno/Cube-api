//Handle the JogoRating(s) data with the API
var GetJogoRating = (id) => {
    return `GetJogoRating(id:${id})`
}

var CreateJogoRating = (value) => {
    console.log('CreateJogoRating')
}
var UpdateJogoRating = (id) => {
    console.log('UpdateJogoRating')
}

module.exports = {
    GetJogoRating,
    CreateJogoRating,
    UpdateJogoRating
}
