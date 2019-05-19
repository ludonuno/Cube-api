
const company = require('./tables/Company')
const engine = require('./tables/Engine')
const parentAdvisory = require('./tables/ParentAdvisory')
const saga = require('./tables/Saga')
const game = require('./tables/Game')
// 5
const gameGallery = require('./tables/GameGallery')
const developers = require('./tables/Developers')
const movie = require('./tables/Movie')
const movieGallery = require('./tables/MovieGallery')
const publishingCompany = require('./tables/PublishingCompany')
// 10
const book = require('./tables/Book')
const series = require('./tables/Series')
const seriesGallery = require('./tables/SeriesGallery')
const season = require('./tables/Season')
const seasonGallery = require('./tables/SeasonGallery')
// 15
const episode = require('./tables/Episode')
const episodeGallery = require('./tables/EpisodeGallery')
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
const celebrityGallery = require('./tables/CelebrityGallery')
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
	gameGallery,
	developers,
	movie,
	movieGallery,
	publishingCompany,
	book,
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