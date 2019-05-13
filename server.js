const express = require("express")
const bodyParser = require("body-parser")
const sizeOf = require("object-sizeof")

const api = require("./api/api.js")

const errorList = {
  route: { error: "Rota não encontrada" },
  parameters: { error: "Parametros errados ou em falta" }
}

const routeList = {
	company: 'Company',
	engine: 'Engine',
	parentAdvisoryGame: 'ParentAdvisoryGame',
	saga: 'Saga',
	game: 'Game',
	gameGallery: 'GameGallery',
	developers: 'Developers',
	parentAdvisoryMovie: 'ParentAdvisoryMovie',
	movie: 'Movie',
	movieGallery: 'MovieGallery',
	publishingCompany: 'PublishingCompany',
	book: 'Book',
	parentAdvisorySeries: 'ParentAdvisorySeries',
	series: 'Series',
	seriesGallery: 'SeriesGallery',
	season: 'Season',
	seasonGallery: 'SeasonGallery',
	episode: 'Episode',
	episodeGallery: 'EpisodeGallery',
	genres: 'Genres',
	genreGame: 'GenreGame',
	genreMovie: 'GenreMovie',
	genreBook: 'GenreBook',
	genreSeries: 'GenreSeries',
	videoGame : 'VideoGame',
	videoMovie : 'VideoMovie',
	videoBook : 'VideoBook',
	videoSeries : 'VideoSeries',
	videoSeason : 'VideoSeason',
	videoEpisode : 'VideoEpisode',
	assignment: 'Assignment',
	celebrity: 'Celebrity',
	celebrityGallery: 'CelebrityGallery',
	celebrityAssignmentGame: 'CelebrityAssignmentGame',
	celebrityAssignmentMovie: 'CelebrityAssignmentMovie',
	celebrityAssignmentSeries: 'CelebrityAssignmentSeries',
	celebrityAssignmentBook: 'CelebrityAssignmentBook',
	user: 'User',
	userAutentication: 'UserAutentication',
	gameRating: 'GameRating'

}


const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/API/:tabela", (req, res, next) => { //Search
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.id || req.query.name || !sizeOf(req.query)) 
			? api.company.GetCompany( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.id || req.query.name || !sizeOf(req.query)) 
			? api.engine.GetEngine( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryGame:
			(req.query.id || !sizeOf(req.query)) 
			? api.parentAdvisoryGame.GetParentAdvisoryGame( req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.saga:
			(req.query.id || req.query.name || !sizeOf(req.query)) 
			? api.saga.GetSaga( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.game:
			(req.query.id || req.query.title || req.query.releaseDate || req.query.engineId || req.query.parentAdvisoryId || req.query.publicadorId || req.query.sagaId || !sizeOf(req.query)) 
			? api.game.GetGame( req.query.id, req.query.title, req.query.releaseDate, req.query.engineId, req.query.parentAdvisoryId, req.query.publicadorId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameGallery:
			(req.query.id || req.query.gameId || !sizeOf(req.query)) 
			? api.gameGallery.GetGameGallery( req.query.id, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.developers:
			(((req.query.gameId && !req.query.companyId) || (!req.query.gameId && req.query.companyId)) || !sizeOf(req.query)) 
			? api.developers.GetDevelopers( req.query.gameId, req.query.companyId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryMovie:
			(req.query.id || !sizeOf(req.query)) 
			? api.parentAdvisoryMovie.GetParentAdvisoryMovie( req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movie:
			(req.query.id || req.query.title || req.query.releaseDate || req.query.durationMin || req.query.durationMax || req.query.parentAdvisoryId || req.query.sagaId || !sizeOf(req.query)) 
			? api.movie.GetMovie( req.query.id, req.query.title, req.query.releaseDate, req.query.durationMin, req.query.durationMax, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movieGallery:
			(req.query.id || req.query.movieId || !sizeOf(req.query)) 
			? api.movieGallery.GetMovieGallery( req.query.id, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.publishingCompany:
			(req.query.id || req.query.name || !sizeOf(req.query)) 
			? api.publishingCompany.GetPublishingCompany( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.book:
			(req.query.id || req.query.title || req.query.releaseDate || req.query.publishingCompanyId || req.query.sagaId || !sizeOf(req.query)) 
			? api.book.GetBook( req.query.id, req.query.title, req.query.releaseDate, req.query.publishingCompanyId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisorySeries:
			(req.query.id || !sizeOf(req.query)) 
			? api.parentAdvisorySeries.GetParentAdvisorySeries( req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.series:
			(req.query.id || req.query.title || req.query.releaseDate || req.query.parentAdvisoryId || req.query.sagaId || !sizeOf(req.query)) 
			? api.series.GetSeries( req.query.id, req.query.title, req.query.releaseDate, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seriesGallery:
			(req.query.id || req.query.seriesId || !sizeOf(req.query)) 
			? api.seriesGallery.GetSeriesGallery( req.query.id, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.season:
			(req.query.id || req.query.title || req.query.releaseDate || req.query.seriesId || !sizeOf(req.query)) 
			? api.season.GetSeason( req.query.id, req.query.title, req.query.releaseDate, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seasonGallery:
			(req.query.id || req.query.seasonId || !sizeOf(req.query)) 
			? api.seasonGallery.GetSeasonGallery( req.query.id, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episode:
			(req.query.id || req.query.title || req.query.releaseDate || req.query.seasonId || !sizeOf(req.query)) 
			? api.season.GetSeason( req.query.id, req.query.title, req.query.releaseDate, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episodeGallery:
			(req.query.id || req.query.episodeId || !sizeOf(req.query)) 
			? api.episodeGallery.GetEpisodeGallery( req.query.id, req.query.episodeId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genres:
			(req.query.id || !sizeOf(req.query)) 
			? api.genres.GetGenres( req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreGame:
			(((req.query.gameId && !req.query.genreId) || (!req.query.gameId && req.query.genreId)) || !sizeOf(req.query)) 
			? api.genreGame.GetGenreGame( req.query.gameId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreMovie:
			(((req.query.movieId && !req.query.genreId) || (!req.query.movieId && req.query.genreId)) || !sizeOf(req.query)) 
			? api.genreMovie.GetGenreMovie( req.query.movieId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreBook:
			(((req.query.bookId && !req.query.genreId) || (!req.query.bookId && req.query.genreId)) || !sizeOf(req.query)) 
			? api.genreBook.GetGenreBook( req.query.bookId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreSeries:
			(((req.query.seriesId && !req.query.genreId) || (!req.query.seriesId && req.query.genreId)) || !sizeOf(req.query)) 
			? api.genreSeries.GetGenreSeries( req.query.seriesId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoGame:
			(req.query.id || req.query.gameId || !sizeOf(req.query)) 
			? api.videoGame.GetVideoGame( req.query.id, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoBook:
			(req.query.id || req.query.bookId || !sizeOf(req.query)) 
			? api.videoBook.GetVideoBook( req.query.id, req.query.bookId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoMovie:
			(req.query.id || req.query.movieId || !sizeOf(req.query)) 
			? api.videoMovie.GetVideoMovie( req.query.id, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoSeries:
			(req.query.id || req.query.seriesId || !sizeOf(req.query)) 
			? api.videoSeries.GetVideoSeries( req.query.id, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoSeason:
			(req.query.id || req.query.seasonId || !sizeOf(req.query)) 
			? api.videoSeason.GetVideoSeason( req.query.id, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoEpisode:
			(req.query.id || req.query.episodeId || !sizeOf(req.query)) 
			? api.videoEpisode.GetVideoEpisode( req.query.id, req.query.episodeId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.assignment:
			(req.query.id || !sizeOf(req.query)) 
			? api.assignment.GetAssignment( req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrity:
			(req.query.id || req.query.name || req.query.birthday || !sizeOf(req.query)) 
			? api.celebrity.GetCelebrity( req.query.id, req.query.name, req.query.birthday, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break	
		case routeList.celebrityGallery:
			(req.query.id || req.query.celebrityId || !sizeOf(req.query)) 
			? api.celebrityGallery.GetCelebrityGallery( req.query.id, req.query.celebrityId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentGame:
			(((req.query.celebrityId && !req.query.assignmentId && !req.query.gameId) || (!req.query.celebrityId && req.query.assignmentId && !req.query.gameId) || (!req.query.celebrityId && !req.query.assignmentId && req.query.gameId)) || !sizeOf(req.query)) 
			? api.celebrityAssignmentGame.GetCelebrityAssignmentGame( req.query.celebrityId, req.query.assignmentId, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentMovie:
			(((req.query.celebrityId && !req.query.assignmentId && !req.query.movieId) || (!req.query.celebrityId && req.query.assignmentId && !req.query.movieId) || (!req.query.celebrityId && !req.query.assignmentId && req.query.movieId)) || !sizeOf(req.query)) 
			? api.celebrityAssignmentMovie.GetCelebrityAssignmentMovie( req.query.celebrityId, req.query.assignmentId, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentSeries:
			(((req.query.celebrityId && !req.query.assignmentId && !req.query.seriesId) || (!req.query.celebrityId && req.query.assignmentId && !req.query.seriesId) || (!req.query.celebrityId && !req.query.assignmentId && req.query.seriesId)) || !sizeOf(req.query)) 
			? api.celebrityAssignmentSeries.GetCelebrityAssignmentSeries( req.query.celebrityId, req.query.assignmentId, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentBook:
			(((req.query.celebrityId && !req.query.assignmentId && !req.query.bookId) || (!req.query.celebrityId && req.query.assignmentId && !req.query.bookId) || (!req.query.celebrityId && !req.query.assignmentId && req.query.bookId)) || !sizeOf(req.query)) 
			? api.celebrityAssignmentBook.GetCelebrityAssignmentBook( req.query.celebrityId, req.query.assignmentId, req.query.bookId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.user:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.user.GetUser( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.userAutentication:
			(req.query.userEmail && req.query.userPassword)
			? api.user.UserAutentication( req.query.userEmail, req.query.userPassword, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameRating:
			(req.query.gameId)
			? api.gameRating.GetGameRating( req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
		}
}).post("/API/:tabela", (req, res, next) => { //Create
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.userEmail && req.query.userPassword && req.query.name) 
			? api.company.CreateCompany( req.query.userEmail, req.query.userPassword, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.userEmail && req.query.userPassword && req.query.name) 
			? api.engine.CreateEngine( req.query.userEmail, req.query.userPassword, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryGame:
			(req.query.userEmail && req.query.userPassword && req.query.rate) 
			? api.parentAdvisoryGame.CreateParentAdvisoryGame( req.query.userEmail, req.query.userPassword, req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.saga:
			(req.query.userEmail && req.query.userPassword && req.query.name) 
			? api.saga.CreateSaga( req.query.userEmail, req.query.userPassword, req.query.name, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.game:
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.engineId && req.query.parentAdvisoryId && req.query.publicadorId && req.query.sagaId)
			? api.game.CreateGame( req.query.userEmail, req.query.userPassword, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.engineId, req.query.parentAdvisoryId, req.query.publicadorId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameGallery:
			(req.query.userEmail && req.query.userPassword && req.query.photo && req.query.gameId) 
			? api.gameGallery.CreateGameGallery( req.query.userEmail, req.query.userPassword, req.query.photo, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.developers:
			(req.query.userEmail && req.query.userPassword && req.query.gameId && req.query.companyId) 
			? api.developers.CreateDevelopers( req.query.userEmail, req.query.userPassword, req.query.gameId, req.query.companyId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryMovie:
			(req.query.userEmail && req.query.userPassword && req.query.rate) 
			? api.parentAdvisoryMovie.CreateParentAdvisoryMovie( req.query.userEmail, req.query.userPassword, req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.game:
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.parentAdvisoryId && req.query.sagaId)
			? api.game.CreateGame( req.query.userEmail, req.query.userPassword, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.duration, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movieGallery:
			(req.query.userEmail && req.query.userPassword && req.query.photo && req.query.movieId) 
			? api.movieGallery.CreateMovieGallery( req.query.userEmail, req.query.userPassword, req.query.photo, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.publishingCompany:
			(req.query.userEmail && req.query.userPassword && req.query.name) 
			? api.publishingCompany.CreatePublishingCompany( req.query.userEmail, req.query.userPassword, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.book:
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.publishingCompanyId && req.query.sagaId || (req.query.photo || req.query.releaseDate || req.query.synopsis)) 
			? api.book.CreateBook( req.query.userEmail, req.query.userPassword, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.publishingCompanyId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisorySeries:
			(req.query.userEmail && req.query.userPassword && req.query.rate) 
			? api.parentAdvisorySeries.CreateParentAdvisorySeries( req.query.userEmail, req.query.userPassword, req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.series:
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.parentAdvisoryId && req.query.sagaId)
			? api.series.CreateSeries( req.query.userEmail, req.query.userPassword, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seriesGallery:
			(req.query.userEmail && req.query.userPassword && req.query.photo && req.query.seriesId) 
			? api.seriesGallery.CreateSeriesGallery( req.query.userEmail, req.query.userPassword, req.query.photo, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.season:
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.seriesId)
			? api.season.CreateSeason( req.query.userEmail, req.query.userPassword, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seasonGallery:
			(req.query.userEmail && req.query.userPassword && req.query.photo && req.query.seasonId) 
			? api.seasonGallery.CreateSeasonGallery( req.query.userEmail, req.query.userPassword, req.query.photo, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episode:
			(req.query.userEmail && req.query.userPassword && req.query.title && req.query.seasonId)
			? api.episode.CreateEpisode( req.query.userEmail, req.query.userPassword, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episodeGallery:
			(req.query.userEmail && req.query.userPassword && req.query.photo && req.query.episodeId) 
			? api.episodeGallery.CreateEpisodeGallery( req.query.userEmail, req.query.userPassword, req.query.photo, req.query.episodeId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genres:
			(req.query.userEmail && req.query.userPassword && req.query.genre) 
			? api.genres.CreateGenres( req.query.userEmail, req.query.userPassword, req.query.genre, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreGame:
			(req.query.userEmail && req.query.userPassword && req.query.gameId && req.query.genreId) 
			? api.genreGame.CreateGenreGame( req.query.userEmail, req.query.userPassword, req.query.gameId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreMovie:
			(req.query.userEmail && req.query.userPassword && req.query.movieId && req.query.genreId) 
			? api.genreMovie.CreateGenreMovie( req.query.userEmail, req.query.userPassword, req.query.movieId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreBook:
			(req.query.userEmail && req.query.userPassword && req.query.bookId && req.query.genreId) 
			? api.genreBook.CreateGenreBook( req.query.userEmail, req.query.userPassword, req.query.bookId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreSeries:
			(req.query.userEmail && req.query.userPassword && req.query.seriesId && req.query.genreId) 
			? api.genreSeries.CreateGenreSeries( req.query.userEmail, req.query.userPassword, req.query.seriesId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoGame:
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.gameId) 
			? api.videoGame.CreateVideoGame( req.query.userEmail, req.query.userPassword, req.query.link, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoMovie:
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.movieId) 
			? api.videoMovie.CreateVideoMovie( req.query.userEmail, req.query.userPassword, req.query.link, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoBook:
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.bookId) 
			? api.videoBook.CreateVideoBook( req.query.userEmail, req.query.userPassword, req.query.link, req.query.bookId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoSeries:
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.seriesId) 
			? api.videoSeries.CreateVideoSeries( req.query.userEmail, req.query.userPassword, req.query.link, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoSeason:
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.seasonId) 
			? api.videoSeason.CreateVideoSeason( req.query.userEmail, req.query.userPassword, req.query.link, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoEpisode:
			(req.query.userEmail && req.query.userPassword && req.query.link && req.query.episodeId) 
			? api.videoEpisode.CreateGameGallery( req.query.userEmail, req.query.userPassword, req.query.link, req.query.episodeId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.assignment:
			(req.query.userEmail && req.query.userPassword && req.query.assignment) 
			? api.assignment.CreateAssignment( req.query.userEmail, req.query.userPassword, req.query.assignment, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrity:
			(req.query.userEmail && req.query.userPassword && req.query.name) 
			? api.celebrity.CreateCelebrity( req.query.userEmail, req.query.userPassword, req.query.name, req.query.photo, req.query.birthday, req.query.biography, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityGallery:
			(req.query.userEmail && req.query.userPassword && req.query.photo && req.query.celebrityId) 
			? api.celebrityGallery.CreateCelebrityGallery( req.query.userEmail, req.query.userPassword, req.query.photo, req.query.celebrityId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentGame:
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.gameId) 
			? api.celebrityAssignmentGame.CreateCelebrityAssignmentGame( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentMovie:
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.movieId) 
			? api.celebrityAssignmentMovie.CreateCelebrityAssignmentMovie( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentSeries:
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.seriesId) 
			? api.celebrityAssignmentSeries.CreateCelebrityAssignmentSeries( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityAssignmentBook:
			(req.query.userEmail && req.query.userPassword && req.query.celebrityId && req.query.assignmentId && req.query.bookId) 
			? api.celebrityAssignmentBook.CreateCelebrityAssignmentBook( req.query.userEmail, req.query.userPassword, req.query.celebrityId, req.query.assignmentId, req.query.bookId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.user:
			(req.query.name && req.query.password && req.query.email || (req.query.photo || req.query.birthday || req.query.description)) 
			? api.user.CreateUser( req.query.name, req.query.password, req.query.email, req.query.photo, req.query.birthday, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameRating:
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.gameId && req.query.rate)
			? api.gameRating.CreateGameRating(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.gameId, req.query.rate, (error, result) => res.json( error ? { error } : { result } ) ) 
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
		case routeList.parentAdvisoryGame:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.rate || req.query.description)) 
			? api.parentAdvisoryGame.UpdateParentAdvisoryGame( req.query.userEmail, req.query.userPassword, req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.saga:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.name || req.query.description)) 
			? api.saga.UpdateSaga( req.query.userEmail, req.query.userPassword, req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.game:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.engineId || req.query.parentAdvisoryId || req.query.publicadorId || req.query.sagaId)) 
			? api.game.UpdateGame( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.engineId, req.query.parentAdvisoryId, req.query.publicadorId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryMovie:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.rate || req.query.description)) 
			? api.parentAdvisoryMovie.UpdateParentAdvisoryMovie( req.query.userEmail, req.query.userPassword, req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movie:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.duration || req.query.parentAdvisoryId || req.query.sagaId)) 
			? api.movie.UpdateMovie( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.duration, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.publishingCompany:
			(req.query.userEmail && req.query.userPassword && req.query.id && req.query.name) 
			? api.publishingCompany.UpdatePublishingCompany( req.query.userEmail, req.query.userPassword, req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.book:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.publishingCompanyId || req.query.sagaId)) 
			? api.book.UpdateBook( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.publishingCompanyId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisorySeries:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.rate || req.query.description)) 
			? api.parentAdvisorySeries.UpdateParentAdvisorySeries( req.query.userEmail, req.query.userPassword, req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.series:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.parentAdvisoryId || req.query.sagaId)) 
			? api.series.UpdateSeries( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.season:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.seriesId)) 
			? api.season.UpdateSeason( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episode:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.seasonId)) 
			? api.episode.UpdateEpisode( req.query.userEmail, req.query.userPassword, req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.assignment:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.assignment || req.query.description)) 
			? api.assignment.UpdateAssignment( req.query.userEmail, req.query.userPassword, req.query.id,  req.query.assignment, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrity:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.name || req.query.photo || req.query.birthday || req.query.biography )) 
			? api.celebrity.UpdateCelebrity( req.query.userEmail, req.query.userPassword, req.query.id, req.query.name, req.query.photo, req.query.birthday, req.query.biography, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.user:
			(req.query.userEmail && req.query.userPassword && req.query.id && (req.query.name || req.query.password || req.query.email || req.query.photo || req.query.birthday || req.query.description || req.query.canEdit)) 
			? api.user.UpdateUser( req.query.userEmail, req.query.userPassword, req.query.id, req.query.name, req.query.password, req.query.email, req.query.photo, req.query.birthday, req.query.description, req.query.canEdit, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameRating:
			(req.query.userEmail && req.query.userPassword && req.query.userId && req.query.gameId && req.query.rate)
			? api.gameRating.UpdateGameRating(req.query.userEmail, req.query.userPassword, req.query.userId, req.query.gameId, req.query.rate, (error, result) => res.json( error ? { error } : { result } ) ) 
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
		case routeList.parentAdvisoryGame:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.parentAdvisoryGame.DeleteParentAdvisoryGame( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
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
		case routeList.gameGallery:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.gameGallery.DeleteGameGallery( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.developers:
			(req.query.userEmail && req.query.userPassword && req.query.gameId && req.query.companyId)
			? api.developers.DeleteDevelopers( req.query.userEmail, req.query.userPassword, req.query.gameId, req.query.companyId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryMovie:
			(req.query.userEmail && req.query.userPassword && req.query.id)
			? api.parentAdvisoryMovie.DeleteParentAdvisoryMovie( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.movie:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.movie.DeleteMovie( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.movieGallery:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.movieGallery.DeleteMovieGallery( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
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
		case routeList.parentAdvisorySeries:
			(req.query.userEmail && req.query.userPassword && req.query.id)
			? api.parentAdvisorySeries.DeleteParentAdvisorySeries( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.series:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.series.DeleteSeries( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.seriesGallery:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.seriesGallery.DeleteSeriesGallery( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.season:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.season.DeleteSeason( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.seasonGallery:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.seasonGallery.DeleteSeasonGallery( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.episode:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.episode.DeleteEpisode( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.episodeGallery:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.episodeGallery.DeleteEpisodeGallery( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.genres:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.genres.DeleteGenres( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.genreGame:
			(req.query.userEmail && req.query.userPassword && req.query.gameId && req.query.genreId)
			? api.genreGame.DeleteGenreGame( req.query.userEmail, req.query.userPassword, req.query.gameId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreMovie:
			(req.query.userEmail && req.query.userPassword && req.query.movieId && req.query.genreId)
			? api.genreMovie.DeleteGenreMovie( req.query.userEmail, req.query.userPassword, req.query.movieId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreBook:
			(req.query.userEmail && req.query.userPassword && req.query.bookId && req.query.genreId)
			? api.genreBook.DeleteGenreBook( req.query.userEmail, req.query.userPassword, req.query.bookId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreSeries:
			(req.query.userEmail && req.query.userPassword && req.query.seriesId && req.query.genreId)
			? api.genreSeries.DeleteGenreSeries( req.query.userEmail, req.query.userPassword, req.query.seriesId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
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
		case routeList.celebrityGallery:
			(req.query.userEmail && req.query.userPassword && req.query.id) 
			? api.celebrityGallery.DeleteCelebrityGallery( req.query.userEmail, req.query.userPassword, req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
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
