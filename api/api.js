// Este ficheiro, api.js tem a função de executar request à base de dados.

//slfj
const slfj                      = require('./tabelas/slfj.js')
const slfjGaleria               = require('./tabelas/slfj_galeria.js')
const slfjPessoaFuncao          = require('./tabelas/slfj_pessoa_funcao.js')
const slfjTipo                  = require('./tabelas/slfj_tipo.js')
const slfjVideo                 = require('./tabelas/slfj_video.js')

const categoria                 = require('./tabelas/categoria.js')
const funcao                    = require('./tabelas/funcao.js')
const saga                      = require('./tabelas/saga.js')
const tipo                      = require('./tabelas/tipo.js')

//serie
const serie                     = require('./tabelas/serie.js')

const episodio                  = require('./tabelas/episodio.js')
const episodioGaleria           = require('./tabelas/episodio_galeria.js')

const temporada                 = require('./tabelas/temporada.js')
const temporadaGaleria          = require('./tabelas/temporada_galeria.js')
const temporadaVideo            = require('./tabelas/temporada_video.js')
const tvPG                      = require('./tabelas/tv_pg.js')

//livro
const livro                     = require('./tabelas/livro.js')
const editora                   = require('./tabelas/editora.js')

//filme
const filme                     = require('./tabelas/filme.js')
const filmePG                   = require('./tabelas/filme_pg.js')

//jogo
const jogo                      = require('./tabelas/jogo.js')
const publicador                = require('./tabelas/publicador.js')
const desenvolvedor             = require('./tabelas/desenvolvedor.js')
const engine                    = require('./tabelas/engine.js')

//pessoa
const pessoa                    = require('./tabelas/pessoa.js')
const pessoaGaleria             = require('./tabelas/pessoa_galeria.js')

//user
const user                      = require('./tabelas/user.js')
const userEpisodioRating        = require('./tabelas/user_episodio_rating.js')
const userFilmeRating           = require('./tabelas/user_filme_rating.js')
const userJogoRating            = require('./tabelas/user_jogo_rating.js')
const userLivroRating           = require('./tabelas/user_livro_rating.js')
const userPessoaHistorico       = require('./tabelas/user_pessoa_historico.js')
const userSlfjComentarioRating  = require('./tabelas/user_slfj_comentario_rating.js')
const userSlfjComentario        = require('./tabelas/user_slfj_comentario.js')
const userSlfjHistorico         = require('./tabelas/user_slfj_historico.js')

module.exports = {
    categoria,
    desenvolvedor,
    editora,
    engine,
    episodio,
    episodioGaleria,
    filme,
    filmePG,
    funcao,
    jogo,
    livro,
    pessoa,
    pessoaGaleria,
    publicador,
    saga,
    serie,
    slfj,
    slfjGaleria,
    slfjPessoaFuncao,
    slfjTipo,
    slfjVideo,
    temporada,
    temporadaGaleria,
    temporadaVideo,
    tipo,
    tvPG,
    user,
    userEpisodioRating,
    userFilmeRating,
    userJogoRating,
    userLivroRating,
    userPessoaHistorico,
    userSlfjComentarioRating,
    userSlfjComentario,
    userSlfjHistorico
}