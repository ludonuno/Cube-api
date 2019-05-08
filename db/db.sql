CREATE TABLE my_Company
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    name character varying(64) NOT NULL,
    CONSTRAINT pkCompany PRIMARY KEY (id)
);

CREATE TABLE my_ParentAdvisoryGame
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    rate character varying(64) NOT NULL,
    description text,
    CONSTRAINT pkParentAdvisoryGame PRIMARY KEY (id)
);

CREATE TABLE my_Engine
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    name character varying(64) NOT NULL,
    CONSTRAINT pkEngine PRIMARY KEY (id)
);

CREATE TABLE my_Saga
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    name character varying(64) NOT NULL,
    description text,
    CONSTRAINT pkSaga PRIMARY KEY (id)
);

CREATE TABLE my_Game
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    title character varying(128) NOT NULL,
    photo bytea,
    releaseDate date,
    synopsis text,
    engineId int REFERENCES my_Engine(id) ON DELETE CASCADE NOT NULL,
    parentAdvisoryId int REFERENCES my_ParentAdvisoryGame(id) ON DELETE CASCADE NOT NULL,
    publicadorId int REFERENCES my_Company(id) ON DELETE CASCADE NOT NULL,
    sagaId int REFERENCES my_Saga(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkGame PRIMARY KEY (id)
);

-- 5

CREATE TABLE my_GameGallery
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    photo bytea NOT NULL,
    GAMEId int REFERENCES my_Game(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkGameGallery PRIMARY KEY (id)
);

CREATE TABLE my_Developers
(
    gameId int REFERENCES my_Game(id) ON DELETE CASCADE NOT NULL,
    companyId int REFERENCES my_Company(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkDevelopers PRIMARY KEY (gameId, companyId)
);


CREATE TABLE my_ParentAdvisoryMovie
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    rate character varying(64) NOT NULL,
    description text,
    CONSTRAINT pkParentAdvisoryMovie PRIMARY KEY (id)
);

CREATE TABLE my_Movie
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    title character varying(128) NOT NULL,
    photo bytea,
    releaseDate date,
    synopsis text,
    duration int,
    parentAdvisoryId int REFERENCES my_ParentAdvisoryMovie(id) ON DELETE CASCADE NOT NULL,
    sagaId int REFERENCES my_Saga(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkMovie PRIMARY KEY (id)
);

CREATE TABLE my_MovieGallery
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    photo bytea NOT NULL,
    movieId int REFERENCES my_Movie(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkMovieGallery PRIMARY KEY (id)
);

-- 10

CREATE TABLE my_PublishingCompany
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    name character varying(64) NOT NULL,
    CONSTRAINT pkPublishingCompany PRIMARY KEY (id)
);

CREATE TABLE my_Book
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    title character varying(128) NOT NULL,
    photo bytea,
    releaseDate date,
    synopsis text,
    publishingCompanyId int REFERENCES my_PublishingCompany(id) ON DELETE CASCADE  NOT NULL,
    sagaId int REFERENCES my_Saga(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkBook PRIMARY KEY (id)
);

CREATE TABLE my_ParentAdvisorySeries
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    rate character varying(64) NOT NULL,
    description text,
    CONSTRAINT pkParentAdvisorySeries PRIMARY KEY (id)
);

CREATE TABLE my_Series
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    title character varying(128) NOT NULL,
    photo bytea,
    releaseDate date,
    synopsis text,
    parentAdvisoryId int REFERENCES my_ParentAdvisorySeries(id) ON DELETE CASCADE  NOT NULL,
    sagaId int REFERENCES my_Saga(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkSeries PRIMARY KEY (id)
);

CREATE TABLE my_SeriesGallery
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    photo bytea NOT NULL,
    seriesId int REFERENCES my_Series(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkSeriesGallery PRIMARY KEY (id)
);

-- 15

CREATE TABLE my_Season
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    title character varying(128) NOT NULL,
    photo bytea,
    releaseDate date,
    synopsis text,
    seriesId int REFERENCES my_Series(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkSeason PRIMARY KEY (id)
);

CREATE TABLE my_SeasonGallery
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    photo bytea NOT NULL,
    seasonId int REFERENCES my_Season(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkSeasonGallery PRIMARY KEY (id)
);

CREATE TABLE my_Episode
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    title character varying(128) NOT NULL,
    photo bytea,
    releaseDate date,
    synopsis text,
    seasonId int REFERENCES my_Season(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkEpisode PRIMARY KEY (id)
);

CREATE TABLE my_EpisodeGallery
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    photo bytea NOT NULL,
    episodeId int REFERENCES my_Episode(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkEpisodeGallery PRIMARY KEY (id)
);

CREATE TABLE my_Genres
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    genre character varying(32) NOT NULL,
    CONSTRAINT pkGenres PRIMARY KEY (id)
);

-- 20

CREATE TABLE my_GenreGame
(
    gameId int REFERENCES my_Game(id) ON DELETE CASCADE NOT NULL,
    genreId int REFERENCES my_Genres(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkGenreGame PRIMARY KEY (gameId, genreId)
);

CREATE TABLE my_GenreMovie
(
    movieId int REFERENCES my_Movie(id) ON DELETE CASCADE NOT NULL,
    genreId int REFERENCES my_Genres(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkGenreMovie PRIMARY KEY (movieId, genreId)
);

CREATE TABLE my_GenreBook
(
    bookId int REFERENCES my_Book(id) ON DELETE CASCADE NOT NULL,
    genreId int REFERENCES my_Genres(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkGenreBook PRIMARY KEY (bookId, genreId)
);

CREATE TABLE my_GenreSeries
(
    seriesId int REFERENCES my_Series(id) ON DELETE CASCADE NOT NULL,
    genreId int REFERENCES my_Genres(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkGenreSeries PRIMARY KEY (seriesId, genreId)
);

CREATE TABLE my_VideoGame
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    link text NOT NULL,
    gameId int REFERENCES my_Game(id) ON DELETE CASCADE NOT NULL,    
    CONSTRAINT pkVideoGame PRIMARY KEY (id)
);

-- 25

CREATE TABLE my_VideoMovie
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    link text NOT NULL,
    movieId int REFERENCES my_Movie(id) ON DELETE CASCADE NOT NULL,    
    CONSTRAINT pkVideoMovie PRIMARY KEY (id)
);

CREATE TABLE my_VideoBook
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    link text NOT NULL,
    bookId int REFERENCES my_Book(id) ON DELETE CASCADE NOT NULL,    
    CONSTRAINT pkVideoBook PRIMARY KEY (id)
);

CREATE TABLE my_VideoSeries
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    link text NOT NULL,
    serieId int REFERENCES my_Series(id) ON DELETE CASCADE NOT NULL,    
    CONSTRAINT pkVideoSeries PRIMARY KEY (id)
);

CREATE TABLE my_VideoSeason
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    link text NOT NULL,
    seasonId int REFERENCES my_Season(id) ON DELETE CASCADE NOT NULL,    
    CONSTRAINT pkVideoSeson PRIMARY KEY (id)
);

CREATE TABLE my_VideoEpisode
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    link text NOT NULL,
    episodeId int REFERENCES my_Episode(id) ON DELETE CASCADE NOT NULL,    
    CONSTRAINT pkVideoEpisode PRIMARY KEY (id)
);

-- 30

CREATE TABLE my_Assignment
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    assignment character varying(32) NOT NULL,
    description text,    
    CONSTRAINT pkAssignment PRIMARY KEY (id)
);

CREATE TABLE my_Celebrity
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    name character varying(64) NOT NULL,
    photo bytea,
    birthday date,
    biography text,
    CONSTRAINT pkCelebrity PRIMARY KEY (id)
);

CREATE TABLE my_CelebrityGallery
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    photo bytea NOT NULL,
    celebrityId int REFERENCES my_Celebrity(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkCelebrityGallery PRIMARY KEY (id)
);

CREATE TABLE my_CelebrityAssignmentGame
(
    celebrityId int REFERENCES my_Celebrity(id) ON DELETE CASCADE NOT NULL,
    assignmentId int REFERENCES my_Assignment(id) ON DELETE CASCADE NOT NULL,
    gameId int REFERENCES my_Game(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkCelebrityAssignmentGame PRIMARY KEY (celebrityId, assignmentId, gameId)
);

CREATE TABLE my_CelebrityAssignmentMovie
(
    celebrityId int REFERENCES my_Celebrity(id) ON DELETE CASCADE NOT NULL,
    assignmentId int REFERENCES my_Assignment(id) ON DELETE CASCADE NOT NULL,
    movieId int REFERENCES my_Movie(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkCelebrityAssignmentMovie PRIMARY KEY (celebrityId, assignmentId, movieId)
);

-- 35

CREATE TABLE my_CelebrityAssignmentBook
(
    celebrityId int REFERENCES my_Celebrity(id) ON DELETE CASCADE NOT NULL,
    assignmentId int REFERENCES my_Assignment(id) ON DELETE CASCADE NOT NULL,
    bookId int REFERENCES my_Book(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkCelebrityAssignmentBook PRIMARY KEY (celebrityId, assignmentId, bookId)
);

CREATE TABLE my_CelebrityAssignmentSeries
(
    celebrityId int REFERENCES my_Celebrity(id) ON DELETE CASCADE NOT NULL,
    assignmentId int REFERENCES my_Assignment(id) ON DELETE CASCADE NOT NULL,
    serieId int REFERENCES my_Series(id) ON DELETE CASCADE NOT NULL,
    CONSTRAINT pkCelebrityAssignmentSeries PRIMARY KEY (celebrityId, assignmentId, serieId)
);

CREATE TABLE my_User
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    name character varying(64) NOT NULL,
    password character varying(128) NOT NULL,
    email character varying(256) NOT NULL UNIQUE,
    photo bytea,
    birthday date,
    description text,
    creationDate date DEFAULT CURRENT_DATE,
    CONSTRAINT pkUser PRIMARY KEY (id)
);

CREATE TABLE my_CelebrityHistory
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    celebrityId int REFERENCES my_Celebrity(id) ON DELETE CASCADE NOT NULL,
    searchedWhen timestamp without time zone DEFAULT CURRENT_DATE,
    CONSTRAINT pkCelebrityHistory PRIMARY KEY (id)
);

CREATE TABLE my_GameHistory
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    gameId int REFERENCES my_Game(id) ON DELETE CASCADE NOT NULL,
    searchedWhen timestamp without time zone DEFAULT CURRENT_DATE,
    CONSTRAINT pkGameHistory PRIMARY KEY (id)
);

-- 40

CREATE TABLE my_MovieHistory
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    movieId int REFERENCES my_Movie(id) ON DELETE CASCADE NOT NULL,
    searchedWhen timestamp without time zone DEFAULT CURRENT_DATE,
    CONSTRAINT pkMovieHistory PRIMARY KEY (id)
);

CREATE TABLE my_BookHistory
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    bookId int REFERENCES my_Book(id) ON DELETE CASCADE NOT NULL,
    searchedWhen timestamp without time zone DEFAULT CURRENT_DATE,
    CONSTRAINT pkBookHistory PRIMARY KEY (id)
);

CREATE TABLE my_SeriesHistory
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    seriesId int REFERENCES my_Series(id) ON DELETE CASCADE NOT NULL,
    searchedWhen timestamp without time zone DEFAULT CURRENT_DATE,
    CONSTRAINT pkSeriesHistory PRIMARY KEY (id)
);

CREATE TABLE my_GameRating
(
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    gameId int REFERENCES my_Game(id) ON DELETE CASCADE NOT NULL,
    rate double precision,
    CONSTRAINT pkGameRating PRIMARY KEY (userId, gameId)
);

CREATE TABLE my_MovieRating
(
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    movieId int REFERENCES my_Movie(id) ON DELETE CASCADE NOT NULL,
    rate double precision,
    CONSTRAINT pkMovieRating PRIMARY KEY (userId, movieId)
);

-- 45

CREATE TABLE my_BookRating
(
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    bookId int REFERENCES my_Book(id) ON DELETE CASCADE NOT NULL,
    rate double precision,
    CONSTRAINT pkBookRating PRIMARY KEY (userId, bookId)
);

CREATE TABLE my_GameComments
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    gameId int REFERENCES my_Game(id) ON DELETE CASCADE NOT NULL,
    comment text,
    responseTo integer REFERENCES my_GameComments(id),
    CONSTRAINT pkGameComments PRIMARY KEY (id)
);

CREATE TABLE my_MovieComments
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    movieId int REFERENCES my_Movie(id) ON DELETE CASCADE NOT NULL,
    comment text,
    responseTo integer REFERENCES my_MovieComments(id),
    CONSTRAINT pkMovieComments PRIMARY KEY (id)
);

CREATE TABLE my_BookComments
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    bookId int REFERENCES my_Book(id) ON DELETE CASCADE NOT NULL,
    comment text,
    responseTo integer REFERENCES my_BookComments(id),
    CONSTRAINT pkBookComments PRIMARY KEY (id)
);

CREATE TABLE my_SeriesComments
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    seriesId int REFERENCES my_Series(id) ON DELETE CASCADE NOT NULL,
    comment text,
    responseTo integer REFERENCES my_SeriesComments(id),
    CONSTRAINT pkSeriesComments PRIMARY KEY (id)
);

-- 50


CREATE TABLE my_EpisodeRating
(
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    episodeId int REFERENCES my_Episode(id) ON DELETE CASCADE NOT NULL,
    rate double precision,
    CONSTRAINT pkEpisodeRating PRIMARY KEY (userId, episodeId)
);

CREATE TABLE my_EpisodeComments
(
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ,
    userId int REFERENCES my_User(id) ON DELETE CASCADE NOT NULL,
    episodeId int REFERENCES my_Episode(id) ON DELETE CASCADE NOT NULL,
    comment text,
    responseTo integer REFERENCES my_EpisodeComments(id),
    CONSTRAINT pkEpisodeComments PRIMARY KEY (id)
);

DROP TABLE my_EpisodeComments, my_EpisodeRating, my_SeriesComments, my_BookComments, my_MovieComments, my_GameComments, my_BookRating, my_MovieRating, my_GameRating, my_SeriesHistory, my_BookHistory, my_MovieHistory, my_GameHistory, my_CelebrityHistory, my_User, my_CelebrityAssignmentSeries, my_CelebrityAssignmentBook, my_CelebrityAssignmentMovie, my_CelebrityAssignmentGame, my_CelebrityGallery, my_Celebrity, my_Assignment, my_VideoEpisode, my_VideoSeason, my_VideoSeries, my_VideoBook, my_VideoMovie, my_VideoGame, my_GenreSeries, my_GenreBook, my_GenreMovie, my_GenreGame, my_Genres, my_EpisodeGallery, my_Episode, my_SeasonGallery, my_Season, my_SeriesGallery, my_Series, my_ParentAdvisorySeries, my_Book, my_PublishingCompany, my_MovieGallery, my_Movie, my_ParentAdvisoryMovie, my_Developers, my_GameGallery, my_Game, my_Saga, my_Engine, my_ParentAdvisoryGame, my_Company

--Apagar tabelas da base de dados antiga
DROP TABLE my_slfj_galeria, my_slfj_pessoa_funcao, my_slfj_tipo, my_slfj_video, my_user_episodio_rating, my_user_filme_rating, my_user_livro_rating, my_user_jogo_rating, my_user_pessoa_historico, my_user_slfj_comentario, my_user_slfj_comentario_rating, my_user_slfj_historico, my_episodio_galeria, my_episodio, my_temporada_galeria, my_temporada_video, my_temporada, my_tv_pg, my_serie, my_slfj, my_saga, my_tipo, my_funcao, my_desenvolvedor, my_engine, my_editora, my_publicador, my_filme_pg, my_filme, my_jogo, my_livro, my_user, my_pessoa_galeria, my_pessoa, my_categoria
