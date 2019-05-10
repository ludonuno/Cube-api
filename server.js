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
	celebrityGallery: 'CelebrityGallery'
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
		default:
			res.json(errorList.route)
			break
		}
}).post("/API/:tabela", (req, res, next) => { //Create
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.name) 
			? api.company.CreateCompany( req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.name) 
			? api.engine.CreateEngine( req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryGame:
			(req.query.rate) 
			? api.parentAdvisoryGame.CreateParentAdvisoryGame( req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.saga:
			(req.query.name) 
			? api.saga.CreateSaga( req.query.name, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.game:
			(req.query.title && (req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.engineId || req.query.parentAdvisoryId || req.query.publicadorId || req.query.sagaId)) 
			? api.game.CreateGame( req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.engineId, req.query.parentAdvisoryId, req.query.publicadorId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.gameGallery:
			(req.query.photo && req.query.gameId) 
			? api.gameGallery.CreateGameGallery( req.query.photo, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.developers:
			(req.query.gameId && req.query.companyId) 
			? api.developers.CreateDevelopers( req.query.gameId, req.query.companyId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryMovie:
			(req.query.rate) 
			? api.parentAdvisoryMovie.CreateParentAdvisoryMovie( req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.game:
			(req.query.title && (req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.duration || req.query.parentAdvisoryId || req.query.sagaId)) 
			? api.game.CreateGame( req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.duration, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movieGallery:
			(req.query.photo && req.query.movieId) 
			? api.movieGallery.CreateMovieGallery( req.query.photo, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.publishingCompany:
			(req.query.name) 
			? api.publishingCompany.CreatePublishingCompany( req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.book:
			(req.query.title && (req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.publishingCompanyId || req.query.sagaId)) 
			? api.book.CreateBook( req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.publishingCompanyId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisorySeries:
			(req.query.rate) 
			? api.parentAdvisorySeries.CreateParentAdvisorySeries( req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.series:
			(req.query.title && (req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.parentAdvisoryId || req.query.sagaId)) 
			? api.series.CreateSeries( req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seriesGallery:
			(req.query.photo && req.query.seriesId) 
			? api.seriesGallery.CreateSeriesGallery( req.query.photo, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.season:
			(req.query.title && (req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.seriesId)) 
			? api.season.CreateSeason( req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.seasonGallery:
			(req.query.photo && req.query.seasonId) 
			? api.seasonGallery.CreateSeasonGallery( req.query.photo, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episode:
			(req.query.title && (req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.seasonId)) 
			? api.episode.CreateEpisode( req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episodeGallery:
			(req.query.photo && req.query.episodeId) 
			? api.episodeGallery.CreateEpisodeGallery( req.query.photo, req.query.episodeId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genres:
			(req.query.genre) 
			? api.genres.CreateGenres( req.query.genre, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreGame:
			(req.query.gameId && req.query.genreId) 
			? api.genreGame.CreateGenreGame( req.query.gameId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreMovie:
			(req.query.movieId && req.query.genreId) 
			? api.genreMovie.CreateGenreMovie( req.query.movieId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreBook:
			(req.query.bookId && req.query.genreId) 
			? api.genreBook.CreateGenreBook( req.query.bookId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreSeries:
			(req.query.seriesId && req.query.genreId) 
			? api.genreSeries.CreateGenreSeries( req.query.seriesId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoGame:
			(req.query.link && req.query.gameId) 
			? api.videoGame.CreateVideoGame( req.query.link, req.query.gameId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoMovie:
			(req.query.link && req.query.movieId) 
			? api.videoMovie.CreateVideoMovie( req.query.link, req.query.movieId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoBook:
			(req.query.link && req.query.bookId) 
			? api.videoBook.CreateVideoBook( req.query.link, req.query.bookId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoSeries:
			(req.query.link && req.query.seriesId) 
			? api.videoSeries.CreateVideoSeries( req.query.link, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoSeason:
			(req.query.link && req.query.seasonId) 
			? api.videoSeason.CreateVideoSeason( req.query.link, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoEpisode:
			(req.query.link && req.query.episodeId) 
			? api.videoEpisode.CreateGameGallery( req.query.link, req.query.episodeId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.assignment:
			(req.query.assignment) 
			? api.assignment.CreateAssignment( req.query.assignment, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrity:
			(req.query.name && (req.query.photo || req.query.birthday || req.query.biography)) 
			? api.celebrity.CreateCelebrity( req.query.name, req.query.photo, req.query.birthday, req.query.biography, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrityGallery:
			(req.query.photo && req.query.celebrityId) 
			? api.celebrityGallery.CreateCelebrityGallery( req.query.photo, req.query.celebrityId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
	}
}).put("/API/:tabela", (req, res, next) => { //Update
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.id && req.query.name) 
			? api.company.UpdateCompany( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.id && req.query.name) 
			? api.engine.UpdateEngine( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryGame:
			(req.query.id && (req.query.rate || req.query.description)) 
			? api.parentAdvisoryGame.UpdateParentAdvisoryGame( req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.saga:
			(req.query.id && (req.query.name || req.query.description)) 
			? api.saga.UpdateSaga( req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.game:
			(req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.engineId || req.query.parentAdvisoryId || req.query.publicadorId || req.query.sagaId)) 
			? api.game.UpdateGame( req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.engineId, req.query.parentAdvisoryId, req.query.publicadorId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryMovie:
			(req.query.id && (req.query.rate || req.query.description)) 
			? api.parentAdvisoryMovie.UpdateParentAdvisoryMovie( req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.movie:
			(req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.duration || req.query.parentAdvisoryId || req.query.sagaId)) 
			? api.movie.UpdateMovie( req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.duration, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.publishingCompany:
			(req.query.id && req.query.name) 
			? api.publishingCompany.UpdatePublishingCompany( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.book:
			(req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.publishingCompanyId || req.query.sagaId)) 
			? api.book.UpdateBook( req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.publishingCompanyId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisorySeries:
			(req.query.id && (req.query.rate || req.query.description)) 
			? api.parentAdvisorySeries.UpdateParentAdvisorySeries( req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.series:
			(req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.parentAdvisoryId || req.query.sagaId)) 
			? api.series.UpdateSeries( req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.parentAdvisoryId, req.query.sagaId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.season:
			(req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.seriesId)) 
			? api.season.UpdateSeason( req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.seriesId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.episode:
			(req.query.id && (req.query.title || req.query.photo || req.query.releaseDate || req.query.synopsis || req.query.seasonId)) 
			? api.episode.UpdateEpisode( req.query.id, req.query.title, req.query.photo, req.query.releaseDate, req.query.synopsis, req.query.seasonId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.assignment:
			(req.query.id && (req.query.assignment || req.query.description)) 
			? api.assignment.UpdateAssignment( req.query.id,  req.query.assignment, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.celebrity:
			(req.query.id && (req.query.name || req.query.photo || req.query.birthday || req.query.biography )) 
			? api.celebrity.UpdateCelebrity( req.query.id, req.query.name, req.query.photo, req.query.birthday, req.query.biography, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
	}
}).delete("/API/:tabela", (req, res, next) => { //Delete
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.id) 
			? api.company.DeleteCompany( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.id) 
			? api.engine.DeleteEngine( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryGame:
			(req.query.id) 
			? api.parentAdvisoryGame.DeleteParentAdvisoryGame( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.saga:
			(req.query.id) 
			? api.saga.DeleteSaga( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.game:
			(req.query.id) 
			? api.game.DeleteGame( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.gameGallery:
			(req.query.id) 
			? api.gameGallery.DeleteGameGallery( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.developers:
			(req.query.gameId && req.query.companyId)
			? api.developers.DeleteDevelopers( req.query.gameId, req.query.companyId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryMovie:
			(req.query.id)
			? api.parentAdvisoryMovie.DeleteParentAdvisoryMovie( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.movie:
			(req.query.id) 
			? api.movie.DeleteMovie( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.movieGallery:
			(req.query.id) 
			? api.movieGallery.DeleteMovieGallery( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.publishingCompany:
			(req.query.id) 
			? api.publishingCompany.DeletePublishingCompany( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.book:
			(req.query.id) 
			? api.book.DeleteBook( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisorySeries:
			(req.query.id)
			? api.parentAdvisorySeries.DeleteParentAdvisorySeries( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.series:
			(req.query.id) 
			? api.series.DeleteSeries( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.seriesGallery:
			(req.query.id) 
			? api.seriesGallery.DeleteSeriesGallery( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.season:
			(req.query.id) 
			? api.season.DeleteSeason( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.seasonGallery:
			(req.query.id) 
			? api.seasonGallery.DeleteSeasonGallery( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.episode:
			(req.query.id) 
			? api.episode.DeleteEpisode( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.episodeGallery:
			(req.query.id) 
			? api.episodeGallery.DeleteEpisodeGallery( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.genres:
			(req.query.id) 
			? api.genres.DeleteGenres( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.genreGame:
			(req.query.gameId && req.query.genreId)
			? api.genreGame.DeleteGenreGame( req.query.gameId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreMovie:
			(req.query.movieId && req.query.genreId)
			? api.genreMovie.DeleteGenreMovie( req.query.movieId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreBook:
			(req.query.bookId && req.query.genreId)
			? api.genreBook.DeleteGenreBook( req.query.bookId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.genreSeries:
			(req.query.seriesId && req.query.genreId)
			? api.genreSeries.DeleteGenreSeries( req.query.seriesId, req.query.genreId, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.videoGame:
			(req.query.id) 
			? api.videoGame.DeleteVideoGame( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.videoMovie:
			(req.query.id) 
			? api.videoMovie.DeleteVideoMovie( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.videoBook:
			(req.query.id) 
			? api.videoBook.DeleteVideoBook( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.videoSeries:
			(req.query.id) 
			? api.videoSeries.DeleteVideoSeries( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.videoSeason:
			(req.query.id) 
			? api.videoSeason.DeleteVideoSeason( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.videoEpisode:
			(req.query.id) 
			? api.videoEpisode.DeleteVideoEpisode( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.assignment:
			(req.query.id)
			? api.assignment.DeleteAssignment( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.celebrity:
			(req.query.id) 
			? api.celebrity.DeleteCelebrity( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
			: res.json(errorList.parameters)
			break
		case routeList.celebrityGallery:
			(req.query.id) 
			? api.celebrityGallery.DeleteCelebrityGallery( req.query.id, (error, result) => res.json( error ? { error } : { result } ) )
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
