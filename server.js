const express = require("express");
const bodyParser = require("body-parser");
const sizeOf = require("object-sizeof");

const api = require("./api/api.js");
const errorList = {
  rota: { error: "Rota não encontrada" },
  parametros: { error: "Parametros errados ou em falta" },
  indisponivel: { error: "Esta URL encontra-se indisponível" }
};

//O campo disponibilidade é para prevenir que os utilizadores utilizem uma rota que tenha erros que possa danificar a base de dados ou a aplicação
const routeList = {
  categoria:                  { nome: "Categoria",                  disponibilidade: { get: true, post: true, put: true, delete: true } },
  desenvolvedor:              { nome: "Desenvolvedor",              disponibilidade: { get: true, post: true, put: true, delete: true } },
  editora:                    { nome: "Editora",                    disponibilidade: { get: true, post: true, put: true, delete: true } },
  engine:                     { nome: "Engine",                     disponibilidade: { get: true, post: true, put: true, delete: true } },
  episodioGaleria:            { nome: "EpisodioGaleria",            disponibilidade: { get: false, post: false, put: false, dlete: false } },
  episodio:                   { nome: "Episodio",                   disponibilidade: { get: false, post: false, put: false, delete: false } },
  filmePG:                    { nome: "FilmePG",                    disponibilidade: { get: true, post: true, put: true, delete: true } },
  filme:                      { nome: "Filme",                      disponibilidade: { get: false, post: false, put: false, delete: false } },
  funcao:                     { nome: "Funcao",                     disponibilidade: { get: true, post: true, put: true, delete: true } },
  livro:                      { nome: "Livro",                      disponibilidade: { get: false, post: false, put: false, delete: false } },
  pessoaGaleria:              { nome: "PessoaGaleria",              disponibilidade: { get: false, post: false, put: false, delete: false } },
  pessoa:                     { nome: "Pessoa",                     disponibilidade: { get: true, post: true, put: true, delete: true } },
  publicador:                 { nome: "Publicador",                 disponibilidade: { get: true, post: true, put: true, delete: true } },
  saga:                       { nome: "Saga",                       disponibilidade: { get: true, post: true, put: true, delete: true } },
  serie:                      { nome: "Serie",                      disponibilidade: { get: false, post: false, put: false, delete: false } },
  slfjGaleria:                { nome: "SlfjGaleria",                disponibilidade: { get: false, post: false, put: false, delete: false } },
  slfjPessoaFuncao:           { nome: "SlfjPessoaFuncao",           disponibilidade: { get: false, post: false, put: false, delete: false } },
  slfjTipo:                   { nome: "SlfjTipo",                   disponibilidade: { get: false, post: false, put: false, delete: false } },
  slfjVideo:                  { nome: "SlfjVideo",                  disponibilidade: { get: false, post: false, put: false, delete: false } },
  slfj:                       { nome: "Slfj",                       disponibilidade: { get: true, post: true, put: true, delete: true } },
  temporadaGaleria:           { nome: "TemporadaGaleria",           disponibilidade: { get: false, post: false, put: false, delete: false } },
  temporadaVideo:             { nome: "TemporadaVideo",             disponibilidade: { get: false, post: false, put: false, delete: false } },
  temporada:                  { nome: "Temporada",                  disponibilidade: { get: false, post: false, put: false, delete: false } },
  tipo:                       { nome: "Tipo",                       disponibilidade: { get: true, post: true, put: true, delete: true } },
  tvPG:                       { nome: "TvPG",                       disponibilidade: { get: true, post: true, put: true, delete: true } },
  userEpisodioRating:         { nome: "UserEpisodioRating",         disponibilidade: { get: false, post: false, put: false, delete: false } },
  userFilmeRating:            { nome: "UserFilmeRating",            disponibilidade: { get: false, post: false, put: false, delete: false } },
  userJogoRating:             { nome: "UserJogoRating",             disponibilidade: { get: false, post: false, put: false, delete: false } },
  userLivroRating:            { nome: "UserLivroRating",            disponibilidade: { get: false, post: false, put: false, delete: false } },
  userPessoaHistorico:        { nome: "UserPessoaHistorico",        disponibilidade: { get: false, post: false, put: false, delete: false } },
  userSlfjComentarioRating:   { nome: "UserSlfjComentarioRating",   disponibilidade: { get: false, post: false, put: false, delete: false } },
  userSlfjComentario:         { nome: "UserSlfjComentario",         disponibilidade: { get: false, post: false, put: false, delete: false } },
  userSlfjHistorico:          { nome: "UserSlfjHistorico",          disponibilidade: { get: false, post: false, put: false, delete: false } }
};


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/API/:tabela", (req, res, next) => { //Search
    switch (req.params.tabela) {
	  case routeList.categoria.nome:
		if (routeList.categoria.disponibilidade.get) {
          if (req.query.id || req.query.descricao || !sizeOf(req.query)) api.categoria.GetCategoria(req.query.id, req.query.descricao, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.desenvolvedor.nome:
        if (routeList.desenvolvedor.disponibilidade.get) {
          if (req.query.id || req.query.nome || !sizeOf(req.query)) api.desenvolvedor.GetDesenvolvedor(req.query.id, req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.editora.nome:
        if (routeList.editora.disponibilidade.get) {
          if (req.query.id || req.query.nome || !sizeOf(req.query)) api.editora.GetEditora(req.query.id, req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.engine.nome:
        if (routeList.engine.disponibilidade.get) {
          if (req.query.id || req.query.nome || !sizeOf(req.query)) api.engine.GetEngine(req.query.id, req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.episodioGaleria.nome:
        if (routeList.episodioGaleria.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.episodio.nome:
        if (routeList.episodio.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.filmePG.nome:
        if (routeList.filmePG.disponibilidade.get) {
          if (req.query.id || req.query.rate || !sizeOf(req.query)) api.filmePG.GetFilmePG(req.query.id, req.query.rate, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.filme.nome:
        if (routeList.filme.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.funcao.nome:
        if (routeList.funcao.disponibilidade.get) {
          if (req.query.id || req.query.descricao || !sizeOf(req.query)) api.funcao.GetFuncao(req.query.id, req.query.descricao, (error, result) => res.json(error ? { error } : { result }))
        } else res.json(errorList.indisponivel);
        break;
      case routeList.livro.nome:
        if (routeList.livro.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.pessoaGaleria.nome:
        if (routeList.pessoaGaleria.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.pessoa.nome:
        if (routeList.pessoa.disponibilidade.get) {
          if (req.query.id || req.query.nome || req.query.dataNascimento || !sizeOf(req.query)) api.pessoa.GetPessoa(req.query.id, req.query.nome, req.query.dataNascimento, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.publicador.nome:
        if (routeList.publicador.disponibilidade.get) {
          if (req.query.id || req.query.nome || !sizeOf(req.query)) api.publicador.GetPublicador(req.query.id, req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.saga.nome:
        if (routeList.saga.disponibilidade.get) {
          if (req.query.id || req.query.nome || !sizeOf(req.query)) api.saga.GetSaga(req.query.id, req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.serie.nome:
        if (routeList.serie.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjGaleria.nome:
        if (routeList.slfjGaleria.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjPessoaFuncao.nome:
        if (routeList.slfjPessoaFuncao.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjTipo.nome:
        if (routeList.slfjTipo.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjVideo.nome:
        if (routeList.slfjVideo.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfj.nome:
        if (routeList.slfj.disponibilidade.get) {
          if (req.query.id || req.query.titulo || req.query.categoriaId || req.query.sagaId || !sizeOf(req.query)) api.slfj.GetSlfj(req.query.id, req.query.titulo, req.query.categoriaId, req.query.sagaId, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporadaGaleria.nome:
        if (routeList.temporadaGaleria.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporadaVideo.nome:
        if (routeList.temporadaVideo.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporada.nome:
        if (routeList.temporada.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.tipo.nome:
        if (routeList.tipo.disponibilidade.get) {
          if (req.query.id || req.query.descricao || !sizeOf(req.query)) api.funcao.GetFuncao(req.query.id, req.query.descricao, (error, result) => res.json(error ? { error } : { result }))
        } else res.json(errorList.indisponivel);
        break;
      case routeList.tvPG.nome:
        if (routeList.tvPG.disponibilidade.get) {
          if (req.query.id || req.query.rate || !sizeOf(req.query)) api.tvPG.GetTvPG(req.query.id, req.query.rate, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userEpisodioRating.nome:
        if (routeList.userEpisodioRating.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userFilmeRating.nome:
        if (routeList.userFilmeRating.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userJogoRating.nome:
        if (routeList.userJogoRating.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userLivroRating.nome:
        if (routeList.userLivroRating.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userPessoaHistorico.nome:
        if (routeList.userPessoaHistorico.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjComentarioRating.nome:
        if (routeList.userSlfjComentarioRating.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjComentario.nome:
        if (routeList.userSlfjComentario.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjHistorico.nome:
        if (routeList.userSlfjHistorico.disponibilidade.get) {
        } else res.json(errorList.indisponivel);
        break;
      default:
        res.json(errorList.rota);
        break;
    }
  })
  .post("/API/:tabela", (req, res, next) => {
    //Create
    switch (req.params.tabela) {
      case routeList.categoria.nome:
        if (routeList.categoria.disponibilidade.post) {
          if (req.query.descricao) api.categoria.CreateCategoria(req.query.descricao, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.desenvolvedor.nome:
        if (routeList.desenvolvedor.disponibilidade.post) {
          if (req.query.nome) api.desenvolvedor.CreateDesenvolvedor(req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.editora.nome:
        if (routeList.editora.disponibilidade.post) {
          if (req.query.nome) api.editora.CreateEditora(req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.engine.nome:
        if (routeList.engine.disponibilidade.post) {
          if (req.query.nome) api.engine.CreateEngine(req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.episodioGaleria.nome:
        if (routeList.episodioGaleria.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.episodio.nome:
        if (routeList.episodio.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.filmePG.nome:
        if (routeList.filmePG.disponibilidade.post) {
          if (req.query.rate) api.filmePG.CreateFilmePG(req.query.rate, req.query.descricao, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.filme.nome:
        if (routeList.filme.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.funcao.nome:
        if (routeList.funcao.disponibilidade.post) {
          if (req.query.descricao) api.funcao.CreateFuncao(req.query.descricao, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.livro.nome:
        if (routeList.livro.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.pessoaGaleria.nome:
        if (routeList.pessoaGaleria.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.pessoa.nome:
        if (routeList.pessoa.disponibilidade.post) {
          if (req.query.nome) api.pessoa.CreatePessoa(req.query.nome, req.query.foto, req.query.dataNascimento, req.query.biografia, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.publicador.nome:
        if (routeList.publicador.disponibilidade.post) {
          if (req.query.nome) api.publicador.CreatePublicador(req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.saga.nome:
        if (routeList.saga.disponibilidade.post) {
          if (req.query.nome) api.saga.CreateSaga(req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.serie.nome:
        if (routeList.serie.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjGaleria.nome:
        if (routeList.slfjGaleria.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjPessoaFuncao.nome:
        if (routeList.slfjPessoaFuncao.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjTipo.nome:
        if (routeList.slfjTipo.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjVideo.nome:
        if (routeList.slfjVideo.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfj.nome:
        if (routeList.slfj.disponibilidade.post) {
          if (req.query.titulo && req.query.categoriaId && req.query.sagaId) api.slfj.CreateSlfj(req.query.titulo, req.query.foto, req.query.sinopse, req.query.categoriaId, req.query.sagaId, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporadaGaleria.nome:
        if (routeList.temporadaGaleria.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporadaVideo.nome:
        if (routeList.temporadaVideo.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporada.nome:
        if (routeList.temporada.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.tipo.nome:
        if (routeList.tipo.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.tvPG.nome:
        if (routeList.tvPG.disponibilidade.post) {
          if (req.query.rate) api.tvPG.CreateTvPG(req.query.rate, req.query.descricao, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userEpisodioRating.nome:
        if (routeList.userEpisodioRating.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userFilmeRating.nome:
        if (routeList.userFilmeRating.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userJogoRating.nome:
        if (routeList.userJogoRating.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userLivroRating.nome:
        if (routeList.userLivroRating.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userPessoaHistorico.nome:
        if (routeList.userPessoaHistorico.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjComentarioRating.nome:
        if (routeList.userSlfjComentarioRating.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjComentario.nome:
        if (routeList.userSlfjComentario.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjHistorico.nome:
        if (routeList.userSlfjHistorico.disponibilidade.post) {
        } else res.json(errorList.indisponivel);
        break;
      default:
        res.json(errorList.rota);
        break;
    }
  })
  .put("/API/:tabela", (req, res, next) => {
    //Update
    switch (req.params.tabela) {
      case routeList.categoria.nome:
        if (routeList.categoria.disponibilidade.put) {
          if (req.query.id && req.query.descricao) api.categoria.UpdateCategoria(req.query.id, req.query.descricao, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.desenvolvedor.nome:
        if (routeList.desenvolvedor.disponibilidade.put) {
          if (req.query.id && req.query.nome) api.desenvolvedor.UpdateDesenvolvedor(req.query.id, req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.editora.nome:
        if (routeList.editora.disponibilidade.put) {
          if (req.query.id && req.query.nome) api.editora.UpdateEditora(req.query.id, req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.engine.nome:
        if (routeList.engine.disponibilidade.put) {
          if (req.query.id && req.query.nome) api.engine.UpdateEngine(req.query.id, req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.episodioGaleria.nome:
        if (routeList.episodioGaleria.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.episodio.nome:
        if (routeList.episodio.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.filmePG.nome:
        if (routeList.filmePG.disponibilidade.put) {
          if (req.query.id && (req.query.rate || req.query.descricao)) api.filmePG.UpdateFilmePG(req.query.id, req.query.rate, req.query.descricao, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.filme.nome:
        if (routeList.filme.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.funcao.nome:
        if (routeList.funcao.disponibilidade.put) {
          if (req.query.id && req.query.descricao) api.funcao.UpdateFuncao(req.query.id, req.query.descricao, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.livro.nome:
        if (routeList.livro.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.pessoaGaleria.nome:
        if (routeList.pessoaGaleria.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.pessoa.nome:
        if (routeList.pessoa.disponibilidade.put) {
          if (req.query.id && (req.query.nome || req.query.foto || req.query.dataNascimento || req.query.biografia)) api.pessoa.UpdatePessoa(req.query.id, req.query.nome, req.query.foto, req.query.dataNascimento, req.query.biografia, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.publicador.nome:
        if (routeList.publicador.disponibilidade.put) {
          if (req.query.id && req.query.nome) api.publicador.UpdatePublicador(req.query.id, req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.saga.nome:
        if (routeList.saga.disponibilidade.put) {
          if (req.query.id && req.query.nome) api.saga.UpdateSaga(req.query.id, req.query.nome, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.serie.nome:
        if (routeList.serie.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjGaleria.nome:
        if (routeList.slfjGaleria.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjPessoaFuncao.nome:
        if (routeList.slfjPessoaFuncao.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjTipo.nome:
        if (routeList.slfjTipo.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjVideo.nome:
        if (routeList.slfjVideo.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfj.nome:
        if (routeList.slfj.disponibilidade.put) {
          if (req.query.id && (req.query.titulo || req.query.foto || req.query.sinopse || req.query.categoriaId || req.query.sagaId)) api.slfj.UpdateSlfj(req.query.id, req.query.titulo, req.query.foto, req.query.sinopse, req.query.categoriaId, req.query.sagaId, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporadaGaleria.nome:
        if (routeList.temporadaGaleria.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporadaVideo.nome:
        if (routeList.temporadaVideo.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporada.nome:
        if (routeList.temporada.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.tipo.nome:
        if (routeList.tipo.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.tvPG.nome:
        if (routeList.tvPG.disponibilidade.put) {
          if (req.query.id && (req.query.rate || req.query.descricao)) api.tvPG.UpdateTvPG(req.query.id, req.query.rate, req.query.descricao, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userEpisodioRating.nome:
        if (routeList.userEpisodioRating.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userFilmeRating.nome:
        if (routeList.userFilmeRating.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userJogoRating.nome:
        if (routeList.userJogoRating.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userLivroRating.nome:
        if (routeList.userLivroRating.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userPessoaHistorico.nome:
        if (routeList.userPessoaHistorico.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjComentarioRating.nome:
        if (routeList.userSlfjComentarioRating.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjComentario.nome:
        if (routeList.userSlfjComentario.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjHistorico.nome:
        if (routeList.userSlfjHistorico.disponibilidade.put) {
        } else res.json(errorList.indisponivel);
        break;
      default:
        res.json(errorList.rota);
        break;
    }
  })
  .delete("/API/:tabela", (req, res, next) => {
    //Delete
    switch (req.params.tabela) {
      case routeList.categoria.nome:
        if (routeList.categoria.disponibilidade.delete) {
          if (req.query.id) api.categoria.DeleteCategoria(req.query.id, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.desenvolvedor.nome:
        if (routeList.desenvolvedor.disponibilidade.delete) {
          if (req.query.id) api.desenvolvedor.DeleteDesenvolvedor(req.query.id, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.editora.nome:
        if (routeList.editora.disponibilidade.delete) {
          if (req.query.id) api.editora.DeleteEditora(req.query.id, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.engine.nome:
        if (routeList.engine.disponibilidade.delete) {
          if (req.query.id) api.engine.DeleteEngine(req.query.id, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.episodioGaleria.nome:
        if (routeList.episodioGaleria.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.episodio.nome:
        if (routeList.episodio.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.filmePG.nome:
        if (routeList.filmePG.disponibilidade.delete) {
          if (req.query.id) api.filmePG.DeleteFilmePG(req.query.id, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.filme.nome:
        if (routeList.filme.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.funcao.nome:
        if (routeList.funcao.disponibilidade.delete) {
          if (req.query.id) api.funcao.DeleteFuncao(req.query.id, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.livro.nome:
        if (routeList.livro.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.pessoaGaleria.nome:
        if (routeList.pessoaGaleria.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.pessoa.nome:
        if (routeList.pessoa.disponibilidade.delete) {
          if (req.query.id) api.pessoa.DeletePessoa(req.query.id, (error, result) => res.json(error ? { error } : { result }))
        } else res.json(errorList.indisponivel);
        break;
      case routeList.publicador.nome:
        if (routeList.publicador.disponibilidade.delete) {
          if (req.query.id) api.publicador.DeletePublicador(req.query.id, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.saga.nome:
        if (routeList.saga.disponibilidade.delete) {
          if (req.query.id) api.saga.DeleteSaga(req.query.id, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.serie.nome:
        if (routeList.serie.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjGaleria.nome:
        if (routeList.slfjGaleria.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjPessoaFuncao.nome:
        if (routeList.slfjPessoaFuncao.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjTipo.nome:
        if (routeList.slfjTipo.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfjVideo.nome:
        if (routeList.slfjVideo.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.slfj.nome:
        if (routeList.slfj.disponibilidade.delete) {
          if (req.query.id) api.slfj.DeleteSlfj(req.query.id, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporadaGaleria.nome:
        if (routeList.temporadaGaleria.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporadaVideo.nome:
        if (routeList.temporadaVideo.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.temporada.nome:
        if (routeList.temporada.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.tipo.nome:
        if (routeList.tipo.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.tvPG.nome:
        if (routeList.tvPG.disponibilidade.delete) {
          if (req.query.id) api.tvPG.DeleteTvPG(req.query.id, (error, result) => res.json(error ? { error } : { result }));
          else res.json(errorList.parametros);
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userEpisodioRating.nome:
        if (routeList.userEpisodioRating.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userFilmeRating.nome:
        if (routeList.userFilmeRating.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userJogoRating.nome:
        if (routeList.userJogoRating.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userLivroRating.nome:
        if (routeList.userLivroRating.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userPessoaHistorico.nome:
        if (routeList.userPessoaHistorico.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjComentarioRating.nome:
        if (routeList.userSlfjComentarioRating.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjComentario.nome:
        if (routeList.userSlfjComentario.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      case routeList.userSlfjHistorico.nome:
        if (routeList.userSlfjHistorico.disponibilidade.delete) {
        } else res.json(errorList.indisponivel);
        break;
      default:
        res.json(errorList.rota);
        break;
    }
  });

app.get("*", (req, res, next) => {
  res.json(errorList.rota);
});

//Porta da aplicação
app.listen(port, () => {
  console.log(`App listen on port ${port}.`);
});
