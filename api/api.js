
const company = require('./tables/Company')
const engine = require('./tables/Engine')
const parentAdvisoryGame = require('./tables/ParentAdvisoryGame')
const saga = require('./tables/Saga')
const game = require('./tables/Game')
// 5
const gameGallery = require('./tables/GameGallery')
const developers = require('./tables/Developers')
const parentAdvisoryMovie = require('./tables/ParentAdvisoryMovie')
const movie = require('./tables/Movie')
const movieGallery = require('./tables/MovieGallery')
// 10
const publishingCompany = require('./tables/PublishingCompany')
const book = require('./tables/Book')
const parentAdvisorySeries = require('./tables/ParentAdvisorySeries')
const series = require('./tables/Series')
const seriesGallery = require('./tables/SeriesGallery')
// 15
const season = require('./tables/Season')
const seasonGallery = require('./tables/SeasonGallery')
const episode = require('./tables/Episode')
const episodeGallery = require('./tables/EpisodeGallery')
const genres = require('./tables/Genres')
// 20
const genreGame = require('./tables/GenreGame')
const genreMovie = require('./tables/GenreMovie')
const genreBook = require('./tables/GenreBook')
const genreSeries = require('./tables/GenreSeries')
const videoGame = require('./tables/VideoGame')
// 25
const videoMovie = require('./tables/VideoMovie')
const videoBook = require('./tables/VideoBook')
const videoSeries = require('./tables/VideoSeries')
const videoSeason = require('./tables/VideoSeason')
const videoEpisode = require('./tables/VideoEpisode')
// 30
const assignment = require('./tables/Assignment')
const celebrity = require('./tables/Celebrity')
const celebrityGallery = require('./tables/CelebrityGallery')
const celebrityAssignmentGame = require('./tables/CelebrityAssignmentGame')
const celebrityAssignmentMovie = require('./tables/CelebrityAssignmentMovie')
// 35
const celebrityAssignmentSeries = require('./tables/CelebrityAssignmentSeries')
const celebrityAssignmentBook = require('./tables/CelebrityAssignmentBook')
const user = require('./tables/User')
const gameRating = require('./tables/GameRating')
const movieRating = require('./tables/MovieRating')
// 40
const bookRating = require('./tables/BookRating')
const gameComments = require('./tables/GameComments')
const movieComments = require('./tables/MovieComments')
const bookComments = require('./tables/BookComments')
const seriesComments = require('./tables/SeriesComments')
// 45
const episodeRating = require('./tables/EpisodeRating')
const episodeComments = require('./tables/EpisodeComments')

module.exports = {
	company,
	engine,
	parentAdvisoryGame,
	saga,
	game,
	gameGallery,
	developers,
	parentAdvisoryMovie,
	movie,
	movieGallery,
	publishingCompany,
	book,
	parentAdvisorySeries,
	series,
	seriesGallery,
	season,
	seasonGallery,
	episode,
	episodeGallery,
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
	celebrityGallery,
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