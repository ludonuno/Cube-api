const express = require('express')
const bodyParser = require('body-parser')
const sizeOf = require('object-sizeof')

const api = require('./API/api.js')
const errorRota = {error: 'Rota não encontrada'}
const errorParametros = {error: 'Parametros inválidos ou em falta'}
const errorIndisponivel = {error: 'Esta Rota encontra-se indisponível'}

const routeList = {
    categoria:                  'Categoria',
    desenvolvedor:              'Desenvolvedor',
    editora:                    'Editora',
    engine:                     'Engine',
    episodioGaleria:            'EpisodioGaleria',
    episodio:                   'Episodio',
    filmePg:                    'FilmePG',
    filme:                      'Filme',
    funcao:                     'Funcao',
    livro:                      'Livro',
    pessoaGaleria:              'PessoaGaleria',
    pessoa:                     'Pessoa',
    publicador:                 'Publicador',
    saga:                       'Saga',
    serie:                      'Serie',
    slfjGaleria:                'SlfjGaleria',
    slfjPessoaFuncao:           'SlfjPessoaFuncao',
    slfjTipo:                   'SlfjTipo',
    slfjVideo:                  'SlfjVideo',
    slfj:                       'Slfj',
    TemporadaGaleria:           'TemporadaGaleria',
    temporadaVideo:             'TemporadaVideo',
    temporada:                  'Temporada',
    tipo:                       'Tipo',
    tvPG:                       'TvPG',
    userEpisodioRating:         'UserEpisodioRating',
    userFilmeRating:            'UserFilmeRating',
    userJogoRating:             'UserJogoRating',
    userLivroRating:            'UserLivroRating',
    userPessoaHistorico:        'UserPessoaHistorico',
    userSlfjComentarioRating:   'UserSlfjComentarioRating',
    userSlfjComentario:         'UserSlfjComentario',
    userSlfjHistorico:          'UserSlfjHistorico'
}

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/API/:tabela', (req, res, next) => { //Search
    switch (req.params.tabela) {
        case routeList.categoria:
            if (req.query.id) api.categoria.GetCategoriaById(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else if(req.query.descricao) api.categoria.GetCategoriaByDescricao(String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else if (!sizeOf(req.query)) api.categoria.GetAllCategorias((error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorParametros) 
            break
        case routeList.desenvolvedor:
            res.json(errorIndisponivel)
            break
        case routeList.editora:
            res.json(errorIndisponivel)
            break
        case routeList.engine:          
            res.json(errorIndisponivel)
            break
        case routeList.episodioGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.episodio:
            res.json(errorIndisponivel)
            break
        case routeList.filmePG:
            res.json(errorIndisponivel)
            break
        case routeList.filme:
            res.json(errorIndisponivel)
            break
        case routeList.funcao:
            res.json(errorIndisponivel)
            break
        case routeList.livro:
            res.json(errorIndisponivel)
            break
        case routeList.pessoaGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.pessoa:
            res.json(errorIndisponivel)
            break
        case routeList.publicador:
            res.json(errorIndisponivel)
            break
        case routeList.saga:
            res.json(errorIndisponivel)
            break
        case routeList.serie:
            res.json(errorIndisponivel)
            break
        case routeList.slfjGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.slfjPessoaFuncao:
            res.json(errorIndisponivel)
            break
        case routeList.slfjTipo:
            res.json(errorIndisponivel)
            break
        case routeList.slfjVideo:
            res.json(errorIndisponivel)
            break
        case routeList.slfj:
            res.json(errorIndisponivel)
            break
        case routeList.temporadaGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.temporadaVideo:
            res.json(errorIndisponivel)
            break
        case routeList.temporada:
            res.json(errorIndisponivel)
            break
        case routeList.tipo:
            res.json(errorIndisponivel)
            break
        case routeList.tvPG:
            res.json(errorIndisponivel)
            break
        case routeList.userEpisodioRating:
            res.json(errorIndisponivel)
            break
        case routeList.userFilmeRating:
            res.json(errorIndisponivel)
            break
        case routeList.userJogoRating:
            res.json(errorIndisponivel)
            break
        case routeList.userLivroRating:
            res.json(errorIndisponivel)
            break
        case routeList.userPessoaHistorico:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjComentarioRating:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjComentario:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjHistorico:
            res.json(errorIndisponivel)
            break
        default:
            res.json(errorRota)
            break
    }
}).post('/API/:tabela', (req, res, next) => { //Create
    switch (req.params.tabela) {
        case routeList.categoria:
            if(req.query.descricao) api.categoria.CreateCategoria(String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorParametros) 
            break
        case routeList.desenvolvedor:
            res.json(errorIndisponivel)
            break
        case routeList.editora:
            res.json(errorIndisponivel)
            break
        case routeList.engine:          
            res.json(errorIndisponivel)
            break
        case routeList.episodioGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.episodio:
            res.json(errorIndisponivel)
            break
        case routeList.filmePG:
            res.json(errorIndisponivel)
            break
        case routeList.filme:
            res.json(errorIndisponivel)
            break
        case routeList.funcao:
            res.json(errorIndisponivel)
            break
        case routeList.livro:
            res.json(errorIndisponivel)
            break
        case routeList.pessoaGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.pessoa:
            res.json(errorIndisponivel)
            break
        case routeList.publicador:
            res.json(errorIndisponivel)
            break
        case routeList.saga:
            res.json(errorIndisponivel)
            break
        case routeList.serie:
            res.json(errorIndisponivel)
            break
        case routeList.slfjGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.slfjPessoaFuncao:
            res.json(errorIndisponivel)
            break
        case routeList.slfjTipo:
            res.json(errorIndisponivel)
            break
        case routeList.slfjVideo:
            res.json(errorIndisponivel)
            break
        case routeList.slfj:
            res.json(errorIndisponivel)
            break
        case routeList.temporadaGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.temporadaVideo:
            res.json(errorIndisponivel)
            break
        case routeList.temporada:
            res.json(errorIndisponivel)
            break
        case routeList.tipo:
            res.json(errorIndisponivel)
            break
        case routeList.tvPG:
            res.json(errorIndisponivel)
            break
        case routeList.userEpisodioRating:
            res.json(errorIndisponivel)
            break
        case routeList.userFilmeRating:
            res.json(errorIndisponivel)
            break
        case routeList.userJogoRating:
            res.json(errorIndisponivel)
            break
        case routeList.userLivroRating:
            res.json(errorIndisponivel)
            break
        case routeList.userPessoaHistorico:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjComentarioRating:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjComentario:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjHistorico:
            res.json(errorIndisponivel)
            break
        default:
            res.json(errorRota)
            break
    }
}).put('/API/:tabela', (req, res, next) => { //Update
    switch (req.params.tabela) {
        case routeList.categoria:
            if (req.query.id && req.query.descricao) api.categoria.UpdateCategoria(Number(req.query.id), String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorParametros) 
            break
        case routeList.desenvolvedor:
            res.json(errorIndisponivel)
            break
        case routeList.editora:
            res.json(errorIndisponivel)
            break
        case routeList.engine:          
            res.json(errorIndisponivel)
            break
        case routeList.episodioGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.episodio:
            res.json(errorIndisponivel)
            break
        case routeList.filmePG:
            res.json(errorIndisponivel)
            break
        case routeList.filme:
            res.json(errorIndisponivel)
            break
        case routeList.funcao:
            res.json(errorIndisponivel)
            break
        case routeList.livro:
            res.json(errorIndisponivel)
            break
        case routeList.pessoaGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.pessoa:
            res.json(errorIndisponivel)
            break
        case routeList.publicador:
            res.json(errorIndisponivel)
            break
        case routeList.saga:
            res.json(errorIndisponivel)
            break
        case routeList.serie:
            res.json(errorIndisponivel)
            break
        case routeList.slfjGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.slfjPessoaFuncao:
            res.json(errorIndisponivel)
            break
        case routeList.slfjTipo:
            res.json(errorIndisponivel)
            break
        case routeList.slfjVideo:
            res.json(errorIndisponivel)
            break
        case routeList.slfj:
            res.json(errorIndisponivel)
            break
        case routeList.temporadaGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.temporadaVideo:
            res.json(errorIndisponivel)
            break
        case routeList.temporada:
            res.json(errorIndisponivel)
            break
        case routeList.tipo:
            res.json(errorIndisponivel)
            break
        case routeList.tvPG:
            res.json(errorIndisponivel)
            break
        case routeList.userEpisodioRating:
            res.json(errorIndisponivel)
            break
        case routeList.userFilmeRating:
            res.json(errorIndisponivel)
            break
        case routeList.userJogoRating:
            res.json(errorIndisponivel)
            break
        case routeList.userLivroRating:
            res.json(errorIndisponivel)
            break
        case routeList.userPessoaHistorico:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjComentarioRating:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjComentario:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjHistorico:
            res.json(errorIndisponivel)
            break
        default:
            res.json(errorRota)
            break
    }
}).delete('/API/:tabela', (req, res, next) => { //Delete
    switch (req.params.tabela) {
        case routeList.categoria:
            if (req.query.id) api.categoria.DeleteCategoria(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorParametros) 
            break
        case routeList.desenvolvedor:
            res.json(errorIndisponivel)
            break
        case routeList.editora:
            res.json(errorIndisponivel)
            break
        case routeList.engine:          
            res.json(errorIndisponivel)
            break
        case routeList.episodioGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.episodio:
            res.json(errorIndisponivel)
            break
        case routeList.filmePG:
            res.json(errorIndisponivel)
            break
        case routeList.filme:
            res.json(errorIndisponivel)
            break
        case routeList.funcao:
            res.json(errorIndisponivel)
            break
        case routeList.livro:
            res.json(errorIndisponivel)
            break
        case routeList.pessoaGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.pessoa:
            res.json(errorIndisponivel)
            break
        case routeList.publicador:
            res.json(errorIndisponivel)
            break
        case routeList.saga:
            res.json(errorIndisponivel)
            break
        case routeList.serie:
            res.json(errorIndisponivel)
            break
        case routeList.slfjGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.slfjPessoaFuncao:
            res.json(errorIndisponivel)
            break
        case routeList.slfjTipo:
            res.json(errorIndisponivel)
            break
        case routeList.slfjVideo:
            res.json(errorIndisponivel)
            break
        case routeList.slfj:
            res.json(errorIndisponivel)
            break
        case routeList.temporadaGaleria:
            res.json(errorIndisponivel)
            break
        case routeList.temporadaVideo:
            res.json(errorIndisponivel)
            break
        case routeList.temporada:
            res.json(errorIndisponivel)
            break
        case routeList.tipo:
            res.json(errorIndisponivel)
            break
        case routeList.tvPG:
            res.json(errorIndisponivel)
            break
        case routeList.userEpisodioRating:
            res.json(errorIndisponivel)
            break
        case routeList.userFilmeRating:
            res.json(errorIndisponivel)
            break
        case routeList.userJogoRating:
            res.json(errorIndisponivel)
            break
        case routeList.userLivroRating:
            res.json(errorIndisponivel)
            break
        case routeList.userPessoaHistorico:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjComentarioRating:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjComentario:
            res.json(errorIndisponivel)
            break
        case routeList.userSlfjHistorico:
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