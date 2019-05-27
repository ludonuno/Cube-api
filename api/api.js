
const company = require('./tables/Company')
const engine = require('./tables/Engine')
const parentAdvisory = require('./tables/ParentAdvisory')
const saga = require('./tables/Saga')
const game = require('./tables/Game')
// 5
const developers = require('./tables/Developers')
const movie = require('./tables/Movie')
const publishingCompany = require('./tables/PublishingCompany')
// 10
const book = require('./tables/Book')
const series = require('./tables/Series')
const season = require('./tables/Season')
// 15
const episode = require('./tables/Episode')
const genres = require('./tables/Genres')
const genreGame = require('./tables/GenreGame')
const genreMovie = require('./tables/GenreMovie')
// 20
const genreBook = require('./tables/GenreBook')
const genreSeries = require('./tables/GenreSeries')
const videoGame = require('./tables/VideoGame')
const videoMovie = require('./tables/VideoMovie')
const videoBook = require('./tables/VideoBook')
// 25
const videoSeries = require('./tables/VideoSeries')
const videoSeason = require('./tables/VideoSeason')
const videoEpisode = require('./tables/VideoEpisode')
const assignment = require('./tables/Assignment')
const celebrity = require('./tables/Celebrity')
// 30
const celebrityAssignmentGame = require('./tables/CelebrityAssignmentGame')
const celebrityAssignmentMovie = require('./tables/CelebrityAssignmentMovie')
const celebrityAssignmentSeries = require('./tables/CelebrityAssignmentSeries')
const celebrityAssignmentBook = require('./tables/CelebrityAssignmentBook')
// 35
const user = require('./tables/User')
const gameRating = require('./tables/GameRating')
const movieRating = require('./tables/MovieRating')
const bookRating = require('./tables/BookRating')
const gameComments = require('./tables/GameComments')
const movieComments = require('./tables/MovieComments')
const bookComments = require('./tables/BookComments')
// 40
const seriesComments = require('./tables/SeriesComments')
const episodeRating = require('./tables/EpisodeRating')
const episodeComments = require('./tables/EpisodeComments')

module.exports = {
	company,
	engine,
	parentAdvisory,
	saga,
	game,
	developers,
	movie,
	publishingCompany,
	book,
	series,
	season,
	episode,
	genres,
	genreGame,
	genreMovie,
	genreBook,
	genreSeries,
	videoGame,
	videoMovie,
	videoBook,
	videoSeries,
	videoSeason,
	videoEpisode,
	assignment,
	celebrity,
	celebrityAssignmentGame,
	celebrityAssignmentMovie,
	celebrityAssignmentSeries,
	celebrityAssignmentBook,
	user,
	gameRating,
	movieRating,
	bookRating,
	episodeRating,
	gameComments,
	movieComments,
	bookComments,
	seriesComments,
	episodeComments

}