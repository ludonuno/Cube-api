
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

// 35
// 40
// 45
// 50

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
	celebrityGallery
}