//Handle the Categoria(s) data with the API

const db = require('./../../db')

var GetAllCategorias = () => {
    db.query('SELECT * FROM my_categoria', (err, res) => {
        if (err) return err
        console.table(res.rows)
    })
}

var GetCategoriaById = (id) => {
    db.query('SELECT * FROM my_categoria WHERE categoria_id = $1', [id], (err, res) => {
        if (err) return err
        console.table(res.rows)
    })
}
var GetCategoriaByDescricao = (descricao) => {
    db.query('SELECT * FROM my_categoria WHERE categoria_descricao = $1', [descricao], (err, res) => {
        if (err) return err
        console.table(res.rows)
    })
}

var InsertCategoria = (categoria) => {
    db.query(`SELECT * FROM my_categoria WHERE categoria_descricao LIKE \'${categoria}\'`, (err, res) => {
        if (err) return err
        if (!res.rows[0]) {
            db.query('INSERT INTO my_categoria (categoria_descricao) VALUES ($1)', [categoria], (err, res) => {
                if (err) {
                    return err
                }
                return res.rows
            })
        } else {
            return { error: 'Categoria já existente'}
        }
    })
    
}
var UpdateCategoria = () => {
    console.log('UpdateCategoria')
}

var DeleteCategoria = () => {
    console.log('DeleteCategoria')
}

module.exports = {
    GetAllCategorias,
    GetCategoriaById,
    GetCategoriaByDescricao,
    InsertCategoria,
    UpdateCategoria,
    DeleteCategoria
}
