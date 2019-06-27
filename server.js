const express = require("express")
const bodyParser = require("body-parser")
const sizeOf = require("object-sizeof")
const cors = require('cors')
const api = require("./api/api.js")

const errorList = {
  route: { error: "Rota não encontrada" },
  parameters: { error: "Parametros errados ou em falta" }
}

const routeList = {
	company: 'Company',
	engine: 'Engine',
	parentAdvisory: 'ParentAdvisory',
	saga: 'Saga',
	game: 'Game',
	developers: 'Developers',
	movie: 'Movie',
	publishingCompany: 'PublishingCompany',
	book: 'Book',
	series: 'Series',
	season: 'Season',
	episode: 'Episode',
	genres: 'Genres',
	genresGame: 'GenresGame',
	genresMovie: 'GenresMovie',
	genresBook: 'GenresBook',
	genresSeries: 'GenresSeries',
	videoGame : 'VideoGame',
	videoMovie : 'VideoMovie',
	videoBook : 'VideoBook',
	videoSeries : 'VideoSeries',
	videoSeason : 'VideoSeason',
	videoEpisode : 'VideoEpisode',
	assignment: 'Assignment',
	celebrity: 'Celebrity',
	celebrityAssignmentGame: 'CelebrityAssignmentGame',
	celebrityAssignmentMovie: 'CelebrityAssignmentMovie',
	celebrityAssignmentSeries: 'CelebrityAssignmentSeries',
	celebrityAssignmentBook: 'CelebrityAssignmentBook',
	user: 'User',
	userAutentication: 'UserAutentication',
	gameRating: 'GameRating',
	movieRating: 'MovieRating',
	bookRating: 'BookRating',
	seriesRating: 'SeriesRating',
	seasonRating: 'SeasonRating',
	episodeRating: 'EpisodeRating',
	gameComments: 'GameComments',
	movieComments: 'MovieComments',
	bookComments: 'BookComments',
	seriesComments: 'SeriesComments',
	episodeComments: 'EpisodeComments'
}

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get("/API/:tabela", (req, res, next) => { //Search
	switch (req.params.tabela) {
		case routeList.company: // DONE
			(req.query.id || req.query.name || !sizeOf(req.query)) 
			? api.company.GetCompany( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine: // DONE
			(req.query.id || req.query.name || !sizeOf(req.query)) 
			? api.engine.GetEngine( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisory: //DONE
			(req.query.id || !sizeOf(req.query)) 
			? api.parentAdvisory.GetParentAdvisory( req.query.id, undefined, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.saga: // DONE
			(req.query.id || req.query.name || !sizeOf(req.query)) 
			? api.saga.GetSaga( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.game: // DONE
			(req.query.id || req.query.title || req.query.releaseDate || req.query.engineId || req.query.parentAdvisoryId || req.query.publicadorId || req.query.sagaId || !sizeOf(req.query)) 
			? api.game.GetGame( req.query.id, req.query.title, req.query.releaseDate, req.query.engineId, req.query.parentAdvisoryId, req.query.publicadorId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.developers: // DONE
			(((req.query.gameId && !req.query.companyId) || (!req.query.gameId && req.query.companyId)) || !sizeOf(req.query)) 
			? api.developers.GetDevelopers( req.query.gameId, req.query.companyId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movie: // DONE
			(req.query.id || req.query.title || req.query.releaseDate || req.query.durationMin || req.query.durationMax || req.query.parentAdvisoryId || req.query.sagaId || !sizeOf(req.query)) 
			? api.movie.GetMovie( req.query.id, req.query.title, req.query.releaseDate, req.query.durationMin, req.query.durationMax, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.publishingCompany: // DONE
			(req.query.id || req.query.name || !sizeOf(req.query)) 
			? api.publishingCompany.GetPublishingCompany( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.book: // DONE
			(req.query.id || req.query.title || req.query.releaseDate || req.query.publishingCompanyId || req.query.sagaId || !sizeOf(req.query)) 
			? api.book.GetBook( req.query.id, req.query.title, req.query.releaseDate, req.query.publishingCompanyId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.series: // DONE
			(req.query.id || req.query.title || req.query.releaseDate || req.query.parentAdvisoryId || req.query.sagaId || !sizeOf(req.query)) 
			? api.series.GetSeries( req.query.id, req.query.title, req.query.releaseDate, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.season: // DONE
			(req.query.id || req.query.title || req.query.releaseDate || req.query.seriesId || !sizeOf(req.query)) 
			? api.season.GetSeason( req.query.id, req.query.title, req.query.releaseDate, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episode: // DONE
			(req.query.id || req.query.title || req.query.releaseDate || req.query.seasonId || !sizeOf(req.query)) 
			? api.episode.GetEpisode( req.query.id, req.query.title, req.query.releaseDate, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genres: // DONE
			(req.query.id || !sizeOf(req.query)) 
			? api.genres.GetGenres( req.query.id, undefined, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresGame: // DONE
			(((req.query.gameId && !req.query.genresId) || (!req.query.gameId && req.query.genresId)) || !sizeOf(req.query)) 
			? api.genresGame.GetGenreGame( req.query.gameId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresMovie: // DONE
			(((req.query.movieId && !req.query.genresId) || (!req.query.movieId && req.query.genresId)) || !sizeOf(req.query)) 
			? api.genresMovie.GetGenreMovie( req.query.movieId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresBook: // DONE
			(((req.query.bookId && !req.query.genresId) || (!req.query.bookId && req.query.genresId)) || !sizeOf(req.query)) 
			? api.genresBook.GetGenreBook( req.query.bookId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresSeries: // DONE
			(((req.query.seriesId && !req.query.genresId) || (!req.query.seriesId && req.query.genresId)) || !sizeOf(req.query)) 
			? api.genresSeries.GetGenreSeries( req.query.seriesId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoGame: // DONE
			(req.query.id || req.query.gameId || !sizeOf(req.query)) 
			? api.videoGame.GetVideoGame( req.query.id, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoBook: // DONE
			(req.query.id || req.query.bookId || !sizeOf(req.query)) 
			? api.videoBook.GetVideoBook( req.query.id, req.query.bookId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoMovie: // DONE
			(req.query.id || req.query.movieId || !sizeOf(req.query)) 
			? api.videoMovie.GetVideoMovie( req.query.id, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoSeries: // DONE
			(req.query.id || req.query.seriesId || !sizeOf(req.query)) 
			? api.videoSeries.GetVideoSeries( req.query.id, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoSeason: // DONE
			(req.query.id || req.query.seasonId || !sizeOf(req.query)) 
			? api.videoSeason.GetVideoSeason( req.query.id, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoEpisode: // DONE
			(req.query.id || req.query.episodeId || !sizeOf(req.query)) 
			? api.videoEpisode.GetVideoEpisode( req.query.id, req.query.episodeId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.assignment: // DONE
			(req.query.id || !sizeOf(req.query)) 
			? api.assignment.GetAssignment( req.query.id, undefined, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrity: // DONE
			(req.query.id || req.query.name || req.query.birthday || !sizeOf(req.query)) 
			? api.celebrity.GetCelebrity( req.query.id, req.query.name, req.query.birthday, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentGame: // DONE
			(((req.query.celebrityId && !req.query.assignmentId && !req.query.gameId) || (!req.query.celebrityId && req.query.assignmentId && !req.query.gameId) || (!req.query.celebrityId && !req.query.assignmentId && req.query.gameId)) || !sizeOf(req.query)) 
			? api.celebrityAssignmentGame.GetCelebrityAssignmentGame( req.query.celebrityId, req.query.assignmentId, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentMovie: // DONE
			(((req.query.celebrityId && !req.query.assignmentId && !req.query.movieId) || (!req.query.celebrityId && req.query.assignmentId && !req.query.movieId) || (!req.query.celebrityId && !req.query.assignmentId && req.query.movieId)) || !sizeOf(req.query)) 
			? api.celebrityAssignmentMovie.GetCelebrityAssignmentMovie( req.query.celebrityId, req.query.assignmentId, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentSeries: // DONE
			(((req.query.celebrityId && !req.query.assignmentId && !req.query.seriesId) || (!req.query.celebrityId && req.query.assignmentId && !req.query.seriesId) || (!req.query.celebrityId && !req.query.assignmentId && req.query.seriesId)) || !sizeOf(req.query)) 
			? api.celebrityAssignmentSeries.GetCelebrityAssignmentSeries( req.query.celebrityId, req.query.assignmentId, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentBook: // DONE
			(((req.query.celebrityId && !req.query.assignmentId && !req.query.bookId) || (!req.query.celebrityId && req.query.assignmentId && !req.query.bookId) || (!req.query.celebrityId && !req.query.assignmentId && req.query.bookId)) || !sizeOf(req.query)) 
			? api.celebrityAssignmentBook.GetCelebrityAssignmentBook( req.query.celebrityId, req.query.assignmentId, req.query.bookId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.user: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.user.GetUser( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.userAutentication: // DONE
			(req.query.userEmail && req.query.userPassword)
			? api.user.UserAutentication( req.query.userEmail, req.query.userPassword, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameRating: // DONE
			(req.query.gameId)
			? api.gameRating.GetGameRating( req.query.gameId, undefined, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movieRating: // DONE
			(req.query.movieId)
			? api.movieRating.GetMovieRating( req.query.movieId, undefined, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.bookRating: // DONE
			(req.query.bookId)
			? api.bookRating.GetBookRating( req.query.bookId, undefined, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seriesRating: // DONE
			(req.query.seriesId)
			? api.episodeRating.GetEpisodeRating( req.query.seriesId, undefined, undefined, undefined, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seasonRating: // DONE
			(req.query.seasonId)
			? api.episodeRating.GetEpisodeRating( undefined, req.query.seasonId, undefined, undefined, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episodeRating: // DONE
			(req.query.episodeId)
			? api.episodeRating.GetEpisodeRating( undefined, undefined, req.query.episodeId, undefined, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameComments: // DONE
			((req.query.gameId && !req.query.responseTo) || (!req.query.gameId && req.query.responseTo))
			? api.gameComments.GetGameComments(req.query.gameId, req.query.responseTo, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movieComments: // DONE
			((req.query.movieId && !req.query.responseTo) || (!req.query.movieId && req.query.responseTo))
			? api.movieComments.GetMovieComments(req.query.movieId, req.query.responseTo, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.bookComments: // DONE
			((req.query.bookId && !req.query.responseTo) || (!req.query.bookId && req.query.responseTo))
			? api.bookComments.GetBookComments(req.query.bookId, req.query.responseTo, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seriesComments: // DONE
			((req.query.seriesId && !req.query.responseTo) || (!req.query.seriesId && req.query.responseTo))
			? api.seriesComments.GetSeriesComments(req.query.seriesId, req.query.responseTo, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episodeComments: // DONE
			((req.query.episodeId && !req.query.responseTo) || (!req.query.episodeId && req.query.responseTo))
			? api.episodeComments.GetEpisodeComments(req.query.episodeId, req.query.responseTo, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
		}
}).post("/API/:tabela", (req, res, next) => { //Create
	switch (req.params.tabela) {
		case routeList.company: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.name) 
			? api.company.CreateCompany( req.query.userEmail, req.query.userPassword, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.name) 
			? api.engine.CreateEngine( req.query.userEmail, req.query.userPassword, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisory: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.rate) 
			? api.parentAdvisory.CreateParentAdvisory( req.query.userEmail, req.query.userPassword, req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.saga: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.name) 
			? api.saga.CreateSaga( req.query.userEmail, req.query.userPassword, req.query.name, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.game: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.engineId && req.query.parentAdvisoryId && req.query.publicadorId && req.query.sagaId)
			? api.game.CreateGame( req.query.userEmail, req.query.userPassword, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.engineId, req.query.parentAdvisoryId, req.query.publicadorId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.developers: // DONE 
			(req.query.userEmail && req.query.userPassword && req.query.gameId && req.query.companyId) 
			? api.developers.CreateDevelopers( req.query.userEmail, req.query.userPassword, req.query.gameId, req.query.companyId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movie: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.parentAdvisoryId && req.query.sagaId)
			? api.movie.CreateMovie( req.query.userEmail, req.query.userPassword, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.duration, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.publishingCompany: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.name) 
			? api.publishingCompany.CreatePublishingCompany( req.query.userEmail, req.query.userPassword, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.book: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.publishingCompanyId && req.query.sagaId) 
			? api.book.CreateBook( req.query.userEmail, req.query.userPassword, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.publishingCompanyId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.series: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.parentAdvisoryId && req.query.sagaId)
			? api.series.CreateSeries( req.query.userEmail, req.query.userPassword, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.season: //DONE
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.seriesId)
			? api.season.CreateSeason( req.query.userEmail, req.query.userPassword, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episode: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.seasonId)
			? api.episode.CreateEpisode( req.query.userEmail, req.query.userPassword, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genres: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.genres) 
			? api.genres.CreateGenres( req.query.userEmail, req.query.userPassword, req.query.genres, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresGame: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.gameId && req.query.genresId) 
			? api.genresGame.CreateGenreGame( req.query.userEmail, req.query.userPassword, req.query.gameId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresMovie: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.movieId && req.query.genresId) 
			? api.genresMovie.CreateGenreMovie( req.query.userEmail, req.query.userPassword, req.query.movieId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresBook: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.bookId && req.query.genresId) 
			? api.genresBook.CreateGenreBook( req.query.userEmail, req.query.userPassword, req.query.bookId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresSeries: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.seriesId && req.query.genresId) 
			? api.genresSeries.CreateGenreSeries( req.query.userEmail, req.query.userPassword, req.query.seriesId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoGame: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.gameId) 
			? api.videoGame.CreateVideoGame( req.query.userEmail, req.query.userPassword, req.query.link, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoMovie: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.movieId) 
			? api.videoMovie.CreateVideoMovie( req.query.userEmail, req.query.userPassword, req.query.link, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoBook: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.bookId) 
			? api.videoBook.CreateVideoBook( req.query.userEmail, req.query.userPassword, req.query.link, req.query.bookId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoSeries: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.seriesId) 
			? api.videoSeries.CreateVideoSeries( req.query.userEmail, req.query.userPassword, req.query.link, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoSeason: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.seasonId) 
			? api.videoSeason.CreateVideoSeason( req.query.userEmail, req.query.userPassword, req.query.link, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoEpisode: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.episodeId) 
			? api.videoEpisode.CreateVideoEpisode( req.query.userEmail, req.query.userPassword, req.query.link, req.query.episodeId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.assignment: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.assignment) 
			? api.assignment.CreateAssignment( req.query.userEmail, req.query.userPassword, req.query.assignment, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrity: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.name) 
			? api.celebrity.CreateCelebrity( req.query.userEmail, req.query.userPassword, req.query.name, req.query.birthday, req.query.biography, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentGame: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.gameId) 
			? api.celebrityAssignmentGame.CreateCelebrityAssignmentGame( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentMovie: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.movieId) 
			? api.celebrityAssignmentMovie.CreateCelebrityAssignmentMovie( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentSeries: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.seriesId) 
			? api.celebrityAssignmentSeries.CreateCelebrityAssignmentSeries( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentBook: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.bookId) 
			? api.celebrityAssignmentBook.CreateCelebrityAssignmentBook( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.bookId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.user: // DONE
			(req.query.name && req.query.password && req.query.email) 
			? api.user.CreateUser( req.query.name, req.query.password, req.query.email, req.query.birthday, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameRating: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.gameId && req.query.rate)
			? api.gameRating.CreateGameRating(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.gameId, req.query.rate, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movieRating: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.movieId && req.query.rate)
			? api.movieRating.CreateMovieRating(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.movieId, req.query.rate, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.bookRating: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.bookId && req.query.rate)
			? api.bookRating.CreateBookRating(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.bookId, req.query.rate, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episodeRating: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.episodeId && req.query.rate)
			? api.episodeRating.CreateEpisodeRating(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.episodeId, req.query.rate, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameComments: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.gameId && req.query.comment || req.query.responseTo)
			? api.gameComments.CreateGameComments(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.gameId, req.query.comment, req.query.responseTo, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movieComments: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.movieId && req.query.comment || req.query.responseTo)
			? api.movieComments.CreateMovieComments(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.movieId, req.query.comment, req.query.responseTo, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.bookComments: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.bookId && req.query.comment || req.query.responseTo)
			? api.bookComments.CreateBookComments(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.bookId, req.query.comment, req.query.responseTo, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seriesComments: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.seriesId && req.query.comment || req.query.responseTo)
			? api.seriesComments.CreateSeriesComments(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.seriesId, req.query.comment, req.query.responseTo, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episodeComments: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.episodeId && req.query.comment || req.query.responseTo)
			? api.episodeComments.CreateEpisodeComments(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.episodeId, req.query.comment, req.query.responseTo, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
	}
}).put("/API/:tabela", (req, res, next) => { //Update
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.userEmail && req.query.userPassword && req.query.id && req.query.name) 
			? api.company.UpdateCompany( req.query.userEmail, req.query.userPassword, req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.userEmail && req.query.userPassword && req.query.id && req.query.name) 
			? api.engine.UpdateEngine( req.query.userEmail, req.query.userPassword, req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisory:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.rate || req.query.description)) 
			? api.parentAdvisory.UpdateParentAdvisory( req.query.userEmail, req.query.userPassword, req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.saga:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.name || req.query.description)) 
			? api.saga.UpdateSaga( req.query.userEmail, req.query.userPassword, req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.game:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.releaseDate || req.query.synopsis || req.query.engineId || req.query.parentAdvisoryId || req.query.publicadorId || req.query.sagaId)) 
			? api.game.UpdateGame( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.engineId, req.query.parentAdvisoryId, req.query.publicadorId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movie:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.releaseDate || req.query.synopsis || req.query.duration || req.query.parentAdvisoryId || req.query.sagaId)) 
			? api.movie.UpdateMovie( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.duration, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.publishingCompany:
			(req.query.userEmail && req.query.userPassword && req.query.id && req.query.name) 
			? api.publishingCompany.UpdatePublishingCompany( req.query.userEmail, req.query.userPassword, req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.book:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.releaseDate || req.query.synopsis || req.query.publishingCompanyId || req.query.sagaId)) 
			? api.book.UpdateBook( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.publishingCompanyId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.series:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.releaseDate || req.query.synopsis || req.query.parentAdvisoryId || req.query.sagaId)) 
			? api.series.UpdateSeries( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.season:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.releaseDate || req.query.synopsis || req.query.seriesId)) 
			? api.season.UpdateSeason( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episode:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.releaseDate || req.query.synopsis || req.query.seasonId)) 
			? api.episode.UpdateEpisode( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.releaseDate, req.query.synopsis, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.assignment:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.assignment || req.query.description)) 
			? api.assignment.UpdateAssignment( req.query.userEmail, req.query.userPassword, req.query.id,  req.query.assignment, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrity:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.name || req.query.birthday || req.query.biography )) 
			? api.celebrity.UpdateCelebrity( req.query.userEmail, req.query.userPassword, req.query.id, req.query.name, req.query.birthday, req.query.biography, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.user:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.name || req.query.password || req.query.email || req.query.birthday || req.query.description || req.query.canEdit)) 
			? api.user.UpdateUser( req.query.userEmail, req.query.userPassword, req.query.id, req.query.name, req.query.password, req.query.email, req.query.birthday, req.query.description, req.query.canEdit, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
	}
}).delete("/API/:tabela", (req, res, next) => { //Delete
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.company.DeleteCompany( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.engine.DeleteEngine( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisory:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.parentAdvisory.DeleteParentAdvisory( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.saga:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.saga.DeleteSaga( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.game:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.game.DeleteGame( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.developers: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.gameId && req.query.companyId)
			? api.developers.DeleteDevelopers( req.query.userEmail, req.query.userPassword, req.query.gameId, req.query.companyId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movie:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.movie.DeleteMovie( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.publishingCompany:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.publishingCompany.DeletePublishingCompany( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.book:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.book.DeleteBook( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.series:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.series.DeleteSeries( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.season:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.season.DeleteSeason( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.episode:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.episode.DeleteEpisode( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.genres:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.genres.DeleteGenres( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.genresGame:
			(req.query.userEmail && req.query.userPassword && req.query.gameId && req.query.genresId)
			? api.genresGame.DeleteGenreGame( req.query.userEmail, req.query.userPassword, req.query.gameId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresMovie:
			(req.query.userEmail && req.query.userPassword && req.query.movieId && req.query.genresId)
			? api.genresMovie.DeleteGenreMovie( req.query.userEmail, req.query.userPassword, req.query.movieId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresBook:
			(req.query.userEmail && req.query.userPassword && req.query.bookId && req.query.genresId)
			? api.genresBook.DeleteGenreBook( req.query.userEmail, req.query.userPassword, req.query.bookId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genresSeries:
			(req.query.userEmail && req.query.userPassword && req.query.seriesId && req.query.genresId)
			? api.genresSeries.DeleteGenreSeries( req.query.userEmail, req.query.userPassword, req.query.seriesId, req.query.genresId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoGame:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.videoGame.DeleteVideoGame( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.videoMovie:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.videoMovie.DeleteVideoMovie( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.videoBook:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.videoBook.DeleteVideoBook( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.videoSeries:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.videoSeries.DeleteVideoSeries( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.videoSeason:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.videoSeason.DeleteVideoSeason( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.videoEpisode:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.videoEpisode.DeleteVideoEpisode( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.assignment:
			(req.query.userEmail && req.query.userPassword && req.query.id)
			? api.assignment.DeleteAssignment( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.celebrity:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.celebrity.DeleteCelebrity( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentGame:
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.gameId)
			? api.celebrityAssignmentGame.DeleteCelebrityAssignmentGame( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentMovie:
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.movieId)
			? api.celebrityAssignmentMovie.DeleteCelebrityAssignmentMovie( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentSeries:
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.seriesId)
			? api.celebrityAssignmentSeries.DeleteCelebrityAssignmentSeries( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentBook:
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.bookId)
			? api.celebrityAssignmentBook.DeleteCelebrityAssignmentBook( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.bookId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameComments: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.id)
			? api.gameComments.DeleteGameComments(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movieComments: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.id)
			? api.movieComments.DeleteMovieComments(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.bookComments: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.id)
			? api.bookComments.DeleteBookComments(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seriesComments: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.id)
			? api.seriesComments.DeleteSeriesComments(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episodeComments: // DONE
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.id)
			? api.episodeComments.DeleteEpisodeComments(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
	}
})

app.get("*", (req, res, next) => {
  res.json(errorList.route)
})

app.listen(port, () => {
  console.log(`App listen on port ${port}.`)
})
