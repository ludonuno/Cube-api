const express = require('express')
const bodyParser = require('body-parser')
const sizeOf = require('object-sizeof')

const api = require('./API/api.js')
const errorList = {
    rota:                       {error: 'Rota não encontrada'},
    parametros:                 {error: 'Parametros inválidos ou em falta'},
    indisponivel:               {error: 'Esta rota encontra-se indisponível'}
}

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

//TODO: verificar o tamanho dos dados que são passados
//TODO: Eliminar a tabela SlfjSaga e passar o campo saga_id para a tabela my_slfj
//TODO: Adicionar a verificação de formatação dos dados nos handlers scripts das tabelas !!!! Atenção aos textos para serem url friendly (ex: terem ? para nao dar erro dos parametros)

app.get('/API/:tabela', (req, res, next) => { //Search
    switch (req.params.tabela) {
        case routeList.categoria:
            if (req.query.id) api.categoria.GetCategoriaById(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else if (req.query.descricao) api.categoria.GetCategoriaByDescricao(String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else if (!sizeOf(req.query)) api.categoria.GetAllCategorias((error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.desenvolvedor:
            if (req.query.id) api.desenvolvedor.GetDesenvolvedorById(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else if (req.query.nome) api.desenvolvedor.GetDesenvolvedorByNome(String(req.query.nome), (error, result) => res.json((error) ? {error} : {result}))
            else if (!sizeOf(req.query)) api.desenvolvedor.GetAllDesenvolvedores((error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.editora:
            if (req.query.id) api.editora.GetEditoraById(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else if (req.query.nome) api.editora.GetEditoraByNome(String(req.query.nome), (error, result) => res.json((error) ? {error} : {result}))
            else if (!sizeOf(req.query)) api.editora.GetAllEditoras((error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.engine:          
            if (req.query.id) api.engine.GetEngineById(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else if (req.query.nome) api.engine.GetEngineByNome(String(req.query.nome), (error, result) => res.json((error) ? {error} : {result}))
            else if (!sizeOf(req.query)) api.engine.GetAllEngines((error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.episodioGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.episodio:
            res.json(errorList.indisponivel)
            break
        case routeList.filmePG:
            res.json(errorList.indisponivel)
            break
        case routeList.filme:
            res.json(errorList.indisponivel)
            break
        case routeList.funcao:
            if (req.query.id) api.funcao.GetFuncaoById(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else if (req.query.descricao) api.funcao.GetFuncaoByDescricao(String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else if (!sizeOf(req.query)) api.funcao.GetAllFuncoes((error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.livro:
            res.json(errorList.indisponivel)
            break
        case routeList.pessoaGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.pessoa:
            res.json(errorList.indisponivel)
            break
        case routeList.publicador:
            res.json(errorList.indisponivel)
            break
        case routeList.saga:
            res.json(errorList.indisponivel)
            break
        case routeList.serie:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjPessoaFuncao:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjTipo:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjVideo:
            res.json(errorList.indisponivel)
            break
        case routeList.slfj:
            res.json(errorList.indisponivel)
            break
        case routeList.temporadaGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.temporadaVideo:
            res.json(errorList.indisponivel)
            break
        case routeList.temporada:
            res.json(errorList.indisponivel)
            break
        case routeList.tipo:
            res.json(errorList.indisponivel)
            break
        case routeList.tvPG:
            if (req.query.id) api.tvPG.GetTvPGById(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else if (req.query.rate) api.tvPG.GetTvPGByRate(String(req.query.rate), (error, result) => res.json((error) ? {error} : {result}))
            else if (!sizeOf(req.query)) api.tvPG.GetAllTvPGs((error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.userEpisodioRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userFilmeRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userJogoRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userLivroRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userPessoaHistorico:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjComentarioRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjComentario:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjHistorico:
            res.json(errorList.indisponivel)
            break
        default:
            res.json(errorList.rota)
            break
    }
}).post('/API/:tabela', (req, res, next) => { //Create
    switch (req.params.tabela) {
        case routeList.categoria:
            if (req.query.descricao) api.categoria.CreateCategoria(String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.desenvolvedor:
            if (req.query.nome) api.desenvolvedor.CreateDesenvolvedor(String(req.query.nome), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.editora:
            if (req.query.nome) api.editora.CreateEditora(String(req.query.nome), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.engine:          
            if (req.query.nome) api.engine.CreateEngine(String(req.query.nome), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.episodioGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.episodio:
            res.json(errorList.indisponivel)
            break
        case routeList.filmePG:
            res.json(errorList.indisponivel)
            break
        case routeList.filme:
            res.json(errorList.indisponivel)
            break
        case routeList.funcao:
            if (req.query.descricao) api.funcao.CreateFuncao(String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.livro:
            res.json(errorList.indisponivel)
            break
        case routeList.pessoaGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.pessoa:
            res.json(errorList.indisponivel)
            break
        case routeList.publicador:
            res.json(errorList.indisponivel)
            break
        case routeList.saga:
            res.json(errorList.indisponivel)
            break
        case routeList.serie:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjPessoaFuncao:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjTipo:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjVideo:
            res.json(errorList.indisponivel)
            break
        case routeList.slfj:
            res.json(errorList.indisponivel)
            break
        case routeList.temporadaGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.temporadaVideo:
            res.json(errorList.indisponivel)
            break
        case routeList.temporada:
            res.json(errorList.indisponivel)
            break
        case routeList.tipo:
            res.json(errorList.indisponivel)
            break
        case routeList.tvPG:
            if (req.query.rate && req.query.descricao) api.tvPG.CreateTvPG(String(req.query.rate), String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else if (req.query.rate) api.tvPG.CreateTvPGRate(String(req.query.rate), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.userEpisodioRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userFilmeRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userJogoRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userLivroRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userPessoaHistorico:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjComentarioRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjComentario:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjHistorico:
            res.json(errorList.indisponivel)
            break
        default:
            res.json(errorList.rota)
            break
    }
}).put('/API/:tabela', (req, res, next) => { //Update
    switch (req.params.tabela) {
        case routeList.categoria:
            if (req.query.id && req.query.descricao) api.categoria.UpdateCategoria(Number(req.query.id), String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.desenvolvedor:
            if (req.query.id && req.query.nome) api.desenvolvedor.UpdateDesenvolvedor(Number(req.query.id), String(req.query.nome), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.editora:
            if (req.query.id && req.query.nome) api.editora.UpdateEditora(Number(req.query.id), String(req.query.nome), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.engine:          
            if (req.query.id && req.query.nome) api.engine.UpdateEngine(Number(req.query.id), String(req.query.nome), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.episodioGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.episodio:
            res.json(errorList.indisponivel)
            break
        case routeList.filmePG:
            res.json(errorList.indisponivel)
            break
        case routeList.filme:
            res.json(errorList.indisponivel)
            break
        case routeList.funcao:
            if (req.query.id && req.query.descricao) api.funcao.UpdateFuncao(Number(req.query.id), String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros)
            break
        case routeList.livro:
            res.json(errorList.indisponivel)
            break
        case routeList.pessoaGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.pessoa:
            res.json(errorList.indisponivel)
            break
        case routeList.publicador:
            res.json(errorList.indisponivel)
            break
        case routeList.saga:
            res.json(errorList.indisponivel)
            break
        case routeList.serie:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjPessoaFuncao:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjTipo:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjVideo:
            res.json(errorList.indisponivel)
            break
        case routeList.slfj:
            res.json(errorList.indisponivel)
            break
        case routeList.temporadaGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.temporadaVideo:
            res.json(errorList.indisponivel)
            break
        case routeList.temporada:
            res.json(errorList.indisponivel)
            break
        case routeList.tipo:
            res.json(errorList.indisponivel)
            break
        case routeList.tvPG:
            if (req.query.id && req.query.rate) api.tvPG.UpdateTvPGRate(Number(req.query.id), String(req.query.rate), (error, result) => res.json((error) ? {error} : {result}))
            else if (req.query.id && req.query.descricao) api.tvPG.UpdateTvPGDescricao(Number(req.query.id), String(req.query.descricao), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.userEpisodioRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userFilmeRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userJogoRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userLivroRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userPessoaHistorico:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjComentarioRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjComentario:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjHistorico:
            res.json(errorList.indisponivel)
            break
        default:
            res.json(errorList.rota)
            break
    }
}).delete('/API/:tabela', (req, res, next) => { //Delete
    switch (req.params.tabela) {
        case routeList.categoria:
            if (req.query.id) api.categoria.DeleteCategoria(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.desenvolvedor:
            if (req.query.id) api.desenvolvedor.DeleteDesenvolvedor(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros)
            break
        case routeList.editora:
            if (req.query.id) api.editora.DeleteEditora(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros)
            break
        case routeList.engine:          
            if (req.query.id) api.engine.DeleteEngine(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros)
            break
        case routeList.episodioGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.episodio:
            res.json(errorList.indisponivel)
            break
        case routeList.filmePG:
            res.json(errorList.indisponivel)
            break
        case routeList.filme:
            res.json(errorList.indisponivel)
            break
        case routeList.funcao:
            if (req.query.id) api.funcao.DeleteFuncao(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.livro:
            res.json(errorList.indisponivel)
            break
        case routeList.pessoaGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.pessoa:
            res.json(errorList.indisponivel)
            break
        case routeList.publicador:
            res.json(errorList.indisponivel)
            break
        case routeList.saga:
            res.json(errorList.indisponivel)
            break
        case routeList.serie:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjPessoaFuncao:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjTipo:
            res.json(errorList.indisponivel)
            break
        case routeList.slfjVideo:
            res.json(errorList.indisponivel)
            break
        case routeList.slfj:
            res.json(errorList.indisponivel)
            break
        case routeList.temporadaGaleria:
            res.json(errorList.indisponivel)
            break
        case routeList.temporadaVideo:
            res.json(errorList.indisponivel)
            break
        case routeList.temporada:
            res.json(errorList.indisponivel)
            break
        case routeList.tipo:
            res.json(errorList.indisponivel)
            break
        case routeList.tvPG:
            if (req.query.id) api.tvPG.DeleteTvPG(Number(req.query.id), (error, result) => res.json((error) ? {error} : {result}))
            else res.json(errorList.parametros) 
            break
        case routeList.userEpisodioRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userFilmeRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userJogoRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userLivroRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userPessoaHistorico:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjComentarioRating:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjComentario:
            res.json(errorList.indisponivel)
            break
        case routeList.userSlfjHistorico:
            res.json(errorList.indisponivel)
            break
        default:
            res.json(errorList.rota)
            break
    }
})

app.get('*', (req, res, next) => {
    res.json(errorList.rota)
})

//Porta da aplicação
app.listen(port, () => {
    console.log(`App listen on port ${port}.`)
})