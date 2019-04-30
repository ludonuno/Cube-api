const db = require("./../../db");
const sizeOf = require("object-sizeof");

const categoria = require("./categoria.js");
const saga = require("./saga.js");

const tabela = {
  tabela: "my_slfj",
  id: "slfj_id",
  titulo: "slfj_titulo",
  foto: "slfj_foto",
  sinopse: "slfj_sinopse",
  categoriaId: "categoria_id",
  sagaId: "saga_id"
};

//TODO: create métodos para não copiar tanto código

var GetSLFJ = (id, titulo, categoriaId, sagaId, callback) => {
  return new Promise((resolve, reject) => {
    let query;
    if (categoriaId || sagaId) {
      if (categoriaId && sagaId) {
        //Para pedidos que têm categoria e saga
        categoria.GetCategoria(categoriaId, undefined, (error, result) => {
          if (result) {
            saga.GetSaga(sagaId, undefined, (error, result) => {
              if (result) {
                if (id && !isNaN(Number(id)) && titulo)
                  query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} AND ${tabela.titulo} like '%${titulo}%' AND ${tabela.categoriaId} = ${categoriaId} AND ${tabela.sagaId} = ${sagaId}`;
                else if (id && !isNaN(Number(id)))
                  query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} AND ${tabela.categoriaId} = ${categoriaId} AND ${tabela.sagaId} = ${sagaId}`;
                else if (titulo)
                  query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.titulo} like '%${titulo}%' AND ${tabela.categoriaId} = ${categoriaId} AND ${tabela.sagaId} = ${sagaId}`;
                else
                  query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.categoriaId} = ${categoriaId} AND ${tabela.sagaId} = ${sagaId}`;

                db.query(query, (error, result) => {
                  if (error) reject(db.message.internalError);
                  else if (!sizeOf(result)) reject(db.message.dataNotFound);
                  else resolve(result);
                });
              } else if (error) reject(error);
            });
          } else if (error) reject(error);
        });
      } else if (categoriaId) {
        //Para pedidos que têm categoria
        categoria.GetCategoria(categoriaId, undefined, (error, result) => {
          if (result) {
            if (id && !isNaN(Number(id)) && titulo)
              query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} AND ${tabela.titulo} like '%${titulo}%' AND ${tabela.categoriaId} = ${categoriaId}`;
            else if (id && !isNaN(Number(id)))
              query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} AND ${tabela.categoriaId} = ${categoriaId}`;
            else if (titulo)
              query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.titulo} like '%${titulo}%' AND ${tabela.categoriaId} = ${categoriaId}`;
            else
              query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.categoriaId} = ${categoriaId}`;

            db.query(query, (error, result) => {
              if (error) reject(db.message.internalError);
              else if (!sizeOf(result)) reject(db.message.dataNotFound);
              else resolve(result);
            });
          } else if (error) reject(error);
        });
      } else if (sagaId) {
        //Para pedidos que têm saga
        saga.GetSaga(sagaId, undefined, (error, result) => {
          if (result) {
            if (id && !isNaN(Number(id)) && titulo)
              query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} AND ${tabela.titulo} like '%${titulo}%' AND ${tabela.sagaId} = ${sagaId}`;
            else if (id && !isNaN(Number(id)))
              query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} AND ${tabela.sagaId} = ${sagaId}`;
            else if (titulo)
              query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.titulo} like '%${titulo}%' AND ${tabela.sagaId} = ${sagaId}`;
            else
              query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.sagaId} = ${sagaId}`;

            db.query(query, (error, result) => {
              if (error) reject(db.message.internalError);
              else if (!sizeOf(result)) reject(db.message.dataNotFound);
              else resolve(result);
            });
          } else if (error) reject(error);
        });
      }
    } else if (id || titulo) {
      //Para pedidos que têm ou id ou titulo ou âmbos
      if (id && !isNaN(Number(id)) && titulo)
        query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id} AND ${tabela.titulo} like '%${titulo}%'`;
      else if (id && !isNaN(Number(id)))
        query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`;
      else if (titulo)
        query = `SELECT * FROM ${tabela.tabela} WHERE ${tabela.titulo} like '%${titulo}%'`;
      if (query) {
        db.query(query, (error, result) => {
          if (error) reject(db.message.internalError);
          else if (!sizeOf(result)) reject(db.message.dataNotFound);
          else resolve(result);
        });
      } else reject(db.message.dataError);
    } else {
      //Para registos que não têm parametros, devolve todos os registos
      query = `SELECT * FROM ${tabela.tabela}`;
      db.query(query, (error, result) => {
        if (error) reject(db.message.internalError);
        else if (!sizeOf(result)) reject(db.message.dataNotFound);
        else resolve(result);
      });
    }
  }).then(
    resolve => {
      callback(undefined, resolve);
    },
    err => {
      callback(err, undefined);
    }
  );
};

var CreateSLFJ = (titulo, foto, sinopse, categoriaId, sagaId, callback) => {
  return new Promise((resolve, reject) => {
    categoria.GetCategoria(categoriaId, undefined, (error, result) => {
      if (error) reject(error);
      else {
        saga.GetSaga(sagaId, undefined, (error, result) => {
          if (error) reject(error);
          else {
            //TODO: foto e sinopse = undefined
            let tabelas = "",
              values = "",
              numeroParametros = 0,
              tabelasExternasInvalidas = 0;
            if (titulo) {
              tabelas += `${tabela.titulo}`;
              values += `'${titulo}'`;
              numeroParametros++;
            }
            if (foto) {
              if (numeroParametros) {
                tabelas += `, `;
                values += `, `;
              }
              tabelas += `${tabela.foto}`;
              values += `${foto}`;
              numeroParametros++;
            }
            if (sinopse) {
              if (numeroParametros) {
                tabelas += `, `;
                values += `, `;
              }
              tabelas += `${tabela.sinopse}`;
              values += `'${sinopse}'`;
              numeroParametros++;
            }
            if (categoriaId) {
              if (numeroParametros) {
                tabelas += `, `;
                values += `, `;
              }
              tabelas += `${tabela.categoriaId}`;
              values += `${categoriaId}`;
              numeroParametros++;
            }
            if (sagaId) {
              if (numeroParametros) {
                tabelas += `, `;
                values += `, `;
              }
              tabelas += `${tabela.sagaId}`;
              values += `${sagaId}`;
              numeroParametros++;
            }
            //FIXME: sinopse não passa ' pelicas

            let query = `INSERT INTO ${
              tabela.tabela
            } (${tabelas}) VALUES (${values})`;
            if (!tabelasExternasInvalidas) {
              db.query(query, (error, result) => {
                console.log(error);
                if (error) reject(db.message.internalError);
                else resolve("Registo inserido com sucesso");
              });
            } else reject(db.message.dataError);
          }
        });
      }
    });
  }).then(
    resolve => {
      callback(undefined, resolve);
    },
    err => {
      callback(err, undefined);
    }
  );
};

var UpdateSLFJ = (id, titulo, foto, sinopse, categoriaId, sagaId, callback) => {
  return new Promise((resolve, reject) => {
    GetSLFJ(id, undefined, undefined, undefined, (error, result) => {
      if (error) reject(error);
      else {
        let query = `UPDATE ${tabela.tabela} SET `,
          numeroParametros = 0,
          tabelasExternasInvalidas = 0;

        if (categoriaId || sagaId) {
          if (categoriaId && sagaId) {
            categoria.GetCategoria(categoriaId, undefined, (error, result) => {
              if (result) {
                saga.GetSaga(sagaId, undefined, (error, result) => {
                  if (result) {
                    if (titulo || foto || sinopse) {
                      // add queryUpdateSLFj ()
                      if (titulo) {
                        query += `${tabela.nome} = '${nome}'`;
                        numeroParametros++;
                      }
                      if (foto) {
                        if (numeroParametros) query += ", ";
                        query += `${tabela.foto} = ${foto}`;
                        numeroParametros++;
                      }
                      if (sinopse) {
                        if (numeroParametros) query += ", ";
                        query += `${
                          tabela.dataNascimento
                        } = '${dataNascimento}'`;
                        numeroParametros++;
                      }
                    } else {
                      query += `${tabela.categoriaId} = ${categoriaId}, ${
                        tabela.sagaId
                      } = ${sagaId}`;
                      //do query
                    }
                  } else if (error) reject(error);
                });
              } else if (error) reject(error);
            });
          } else if (categoriaId) {
            categoria.GetCategoria(categoriaId, undefined, (error, result) => {
              if (result) {
              } else if (error) reject(error);
            });
          } else if (sagaId) {
            saga.GetSaga(sagaId, undefined, (error, result) => {
              if (result) {
              } else if (error) reject(error);
            });
          }
        } else if (titulo || foto || sinopse) {
        }

        if (categoriaId) {
          categoria.GetCategoria(categoriaId, undefined, (error, result) => {
            if (result) {
              if (numeroParametros) query += ", ";
              query += `${tabela.categoriaId} = ${categoriaId}`;
              numeroParametros++;
            } else if (error) tabelasExternasInvalidas++;
          });
        }
        if (sagaId) {
          saga.GetSaga(sagaId, undefined, (error, result) => {
            if (result) {
              if (numeroParametros) query += ", ";
              query += `${tabela.sagaId} = ${sagaId}`;
              numeroParametros++;
            } else if (error) tabelasExternasInvalidas++;
          });
        }
        query += ` WHERE ${tabela.id} = ${id}`;
        if (!tabelasExternasInvalidas) {
          db.query(query, (error, result) => {
            if (error) reject(db.message.error);
            else resolve("Registo alterado com sucesso");
          });
        } else reject(db.message.dataError);
      }
    });
  }).then(
    resolve => {
      callback(undefined, resolve);
    },
    err => {
      callback(err, undefined);
    }
  );
};

var DeleteSLFJ = (id, callback) => {
  return new Promise((resolve, reject) => {
    GetSLFJ(id, undefined, undefined, undefined, (error, result) => {
      if (error) reject(error);
      else {
        db.query(
          `DELETE FROM ${tabela.tabela} WHERE ${tabela.id} = ${id}`,
          (error, result) => {
            if (error) reject(db.message.error);
            else resolve("Registo apagado com sucesso");
          }
        );
      }
    });
  }).then(
    resolve => {
      callback(undefined, resolve);
    },
    err => {
      callback(err, undefined);
    }
  );
};

module.exports = {
  GetSLFJ,
  CreateSLFJ,
  UpdateSLFJ,
  DeleteSLFJ
};
