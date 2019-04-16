//Handle the EpisodioRating(s) data with the API
var GetEpisodioRating = (id) => {
    return `GetEpisodioRating(id:${id})`
}

var CreateEpisodioRating = (value) => {
    console.log('CreateEpisodioRating')
}
var UpdateEpisodioRating = (id) => {
    console.log('UpdateEpisodioRating')
}

module.exports = {
    GetEpisodioRating,
    CreateEpisodioRating,
    UpdateEpisodioRating
}
