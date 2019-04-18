const express = require('express')
const bodyParser = require('body-parser')
const sizeOf = require('object-sizeof')

const api = require('./API/api.js')
const errorRota = {error: 'Rota não encontrada'}
const errorParametros = {error: 'Parametros inválidos ou em falta'}
const errorIndisponivel = {error: 'Esta Rota encontra-se indisponível'}

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/API/:tabela', (req, res, next) => { //Search
    switch (req.params.tabela) {
        case 'Categoria':
            if (req.query.id) api.categoria.GetCategoriaById(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else if(req.query.descricao) api.categoria.GetCategoriaByDescricao(String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else if (!sizeOf(req.query)) api.categoria.GetAllCategorias((error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorParametros) 
            break
        case 'Desenvolvedor':
            res.json(errorIndisponivel)
            break
        case 'Editora':
            res.json(errorIndisponivel)
            break
        case 'Engine':          
            res.json(errorIndisponivel)
            break
        case 'EpisodioGaleria':
            res.json(errorIndisponivel)
            break
        case 'Episodio':
            res.json(errorIndisponivel)
            break
        case 'FilmePG':
            res.json(errorIndisponivel)
            break
        case 'Filme':
            res.json(errorIndisponivel)
            break
        case 'Funcao':
            res.json(errorIndisponivel)
            break
        case 'Livro':
            res.json(errorIndisponivel)
            break
        case 'PessoaGaleria':
            res.json(errorIndisponivel)
            break
        case 'Pessoa':
            res.json(errorIndisponivel)
            break
        case 'Publicador':
            res.json(errorIndisponivel)
            break
        case 'Saga':
            res.json(errorIndisponivel)
            break
        case 'Serie':
            res.json(errorIndisponivel)
            break
        case 'SlfjGaleria':
            res.json(errorIndisponivel)
            break
        case 'SlfjPessoaFuncao':
            res.json(errorIndisponivel)
            break
        case 'SlfjTipo':
            res.json(errorIndisponivel)
            break
        case 'SlfjVideo':
            res.json(errorIndisponivel)
            break
        case 'Slfj':
            res.json(errorIndisponivel)
            break
        case 'TemporadaGaleria':
            res.json(errorIndisponivel)
            break
        case 'TemporadaVideo':
            res.json(errorIndisponivel)
            break
        case 'Temporada':
            res.json(errorIndisponivel)
            break
        case 'Tipo':
            res.json(errorIndisponivel)
            break
        case 'TvPG':
            res.json(errorIndisponivel)
            break
        case 'UserEpisodioRating':
            res.json(errorIndisponivel)
            break
        case 'UserFilmeRating':
            res.json(errorIndisponivel)
            break
        case 'UserJogoRating':
            res.json(errorIndisponivel)
            break
        case 'UserLivroRating':
            res.json(errorIndisponivel)
            break
        case 'UserPessoaHistorico':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjComentarioRating':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjComentario':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjHistorico':
            res.json(errorIndisponivel)
            break
        default:
            res.json(errorRota)
            break
    }
}).post('/API/:tabela', (req, res, next) => { //Create
    switch (req.params.tabela) {
        case 'Categoria':
            if(req.query.descricao) api.categoria.CreateCategoria(String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorParametros) 
            break
        case 'Desenvolvedor':
            res.json(errorIndisponivel)
            break
        case 'Editora':
            res.json(errorIndisponivel)
            break
        case 'Engine':
            res.json(errorIndisponivel)
            break
        case 'EpisodioGaleria':
            res.json(errorIndisponivel)
            break
        case 'Episodio':
            res.json(errorIndisponivel)
            break
        case 'FilmePG':
            res.json(errorIndisponivel)
            break
        case 'Filme':
            res.json(errorIndisponivel)
            break
        case 'Funcao':
            res.json(errorIndisponivel)
            break
        case 'Livro':
            res.json(errorIndisponivel)
            break
        case 'PessoaGaleria':
            res.json(errorIndisponivel)
            break
        case 'Pessoa':
            res.json(errorIndisponivel)
            break
        case 'Publicador':
            res.json(errorIndisponivel)
            break
        case 'Saga':
            res.json(errorIndisponivel)
            break
        case 'Serie':
            res.json(errorIndisponivel)
            break
        case 'SlfjGaleria':
            res.json(errorIndisponivel)
            break
        case 'SlfjPessoaFuncao':
            res.json(errorIndisponivel)
            break
        case 'SlfjTipo':
            res.json(errorIndisponivel)
            break
        case 'SlfjVideo':
            res.json(errorIndisponivel)
            break
        case 'Slfj':
            res.json(errorIndisponivel)
            break
        case 'TemporadaGaleria':
            res.json(errorIndisponivel)
            break
        case 'TemporadaVideo':
            res.json(errorIndisponivel)
            break
        case 'Temporada':
            res.json(errorIndisponivel)
            break
        case 'Tipo':
            res.json(errorIndisponivel)
            break
        case 'TvPG':
            res.json(errorIndisponivel)
            break
        case 'UserEpisodioRating':
            res.json(errorIndisponivel)
            break
        case 'UserFilmeRating':
            res.json(errorIndisponivel)
            break
        case 'UserJogoRating':
            res.json(errorIndisponivel)
            break
        case 'UserLivroRating':
            res.json(errorIndisponivel)
            break
        case 'UserPessoaHistorico':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjComentarioRating':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjComentario':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjHistorico':
            res.json(errorIndisponivel)
            break
        default:
            res.json(errorRota)
            break
    }
}).put('/API/:tabela', (req, res, next) => { //Update
    switch (req.params.tabela) {
        case 'Categoria':
            if (req.query.id && req.query.descricao) api.categoria.UpdateCategoria(Number(req.query.id), String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorParametros) 
            break
        case 'Desenvolvedor':
            res.json(errorIndisponivel)
            break
        case 'Editora':
            res.json(errorIndisponivel)
            break
        case 'Engine':
            res.json(errorIndisponivel)
            break
        case 'EpisodioGaleria':
            res.json(errorIndisponivel)
            break
        case 'Episodio':
            res.json(errorIndisponivel)
            break
        case 'FilmePG':
            res.json(errorIndisponivel)
            break
        case 'Filme':
            res.json(errorIndisponivel)
            break
        case 'Funcao':
            res.json(errorIndisponivel)
            break
        case 'Livro':
            res.json(errorIndisponivel)
            break
        case 'PessoaGaleria':
            res.json(errorIndisponivel)
            break
        case 'Pessoa':
            res.json(errorIndisponivel)
            break
        case 'Publicador':
            res.json(errorIndisponivel)
            break
        case 'Saga':
            res.json(errorIndisponivel)
            break
        case 'Serie':
            res.json(errorIndisponivel)
            break
        case 'SlfjGaleria':
            res.json(errorIndisponivel)
            break
        case 'SlfjPessoaFuncao':
            res.json(errorIndisponivel)
            break
        case 'SlfjTipo':
            res.json(errorIndisponivel)
            break
        case 'SlfjVideo':
            res.json(errorIndisponivel)
            break
        case 'Slfj':
            res.json(errorIndisponivel)
            break
        case 'TemporadaGaleria':
            res.json(errorIndisponivel)
            break
        case 'TemporadaVideo':
            res.json(errorIndisponivel)
            break
        case 'Temporada':
            res.json(errorIndisponivel)
            break
        case 'Tipo':
            res.json(errorIndisponivel)
            break
        case 'TvPG':
            res.json(errorIndisponivel)
            break
        case 'UserEpisodioRating':
            res.json(errorIndisponivel)
            break
        case 'UserFilmeRating':
            res.json(errorIndisponivel)
            break
        case 'UserJogoRating':
            res.json(errorIndisponivel)
            break
        case 'UserLivroRating':
            res.json(errorIndisponivel)
            break
        case 'UserPessoaHistorico':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjComentarioRating':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjComentario':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjHistorico':
            res.json(errorIndisponivel)
            break
        default:
            res.json(errorRota)
            break
    }
}).delete('/API/:tabela', (req, res, next) => { //Delete
    switch (req.params.tabela) {
        case 'Categoria':
            if (req.query.id) api.categoria.DeleteCategoria(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorParametros) 
            break
        case 'Desenvolvedor':
            res.json(errorIndisponivel)
            break
        case 'Editora':
            res.json(errorIndisponivel)
            break
        case 'Engine':
            res.json(errorIndisponivel)
            break
        case 'EpisodioGaleria':
            res.json(errorIndisponivel)
            break
        case 'Episodio':
            res.json(errorIndisponivel)
            break
        case 'FilmePG':
            res.json(errorIndisponivel)
            break
        case 'Filme':
            res.json(errorIndisponivel)
            break
        case 'Funcao':
            res.json(errorIndisponivel)
            break
        case 'Livro':
            res.json(errorIndisponivel)
            break
        case 'PessoaGaleria':
            res.json(errorIndisponivel)
            break
        case 'Pessoa':
            res.json(errorIndisponivel)
            break
        case 'Publicador':
            res.json(errorIndisponivel)
            break
        case 'Saga':
            res.json(errorIndisponivel)
            break
        case 'Serie':
            res.json(errorIndisponivel)
            break
        case 'SlfjGaleria':
            res.json(errorIndisponivel)
            break
        case 'SlfjPessoaFuncao':
            res.json(errorIndisponivel)
            break
        case 'SlfjTipo':
            res.json(errorIndisponivel)
            break
        case 'SlfjVideo':
            res.json(errorIndisponivel)
            break
        case 'Slfj':
            res.json(errorIndisponivel)
            break
        case 'TemporadaGaleria':
            res.json(errorIndisponivel)
            break
        case 'TemporadaVideo':
            res.json(errorIndisponivel)
            break
        case 'Temporada':
            res.json(errorIndisponivel)
            break
        case 'Tipo':
            res.json(errorIndisponivel)
            break
        case 'TvPG':
            res.json(errorIndisponivel)
            break
        case 'UserEpisodioRating':
            res.json(errorIndisponivel)
            break
        case 'UserFilmeRating':
            res.json(errorIndisponivel)
            break
        case 'UserJogoRating':
            res.json(errorIndisponivel)
            break
        case 'UserLivroRating':
            res.json(errorIndisponivel)
            break
        case 'UserPessoaHistorico':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjComentarioRating':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjComentario':
            res.json(errorIndisponivel)
            break
        case 'UserSlfjHistorico':
            res.json(errorIndisponivel)
            break
        default:
            res.json(errorRota)
            break
    }
})

app.get('*', (req, res, next) => {
    res.json(errorRota)
})

//Porta da aplicação
app.listen(port, () => {
    console.log(`App listen on port ${port}.`)
})