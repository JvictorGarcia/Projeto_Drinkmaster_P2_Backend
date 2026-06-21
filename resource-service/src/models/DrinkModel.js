const db = require("../config/database");

function listarTodos(callback) {
  db.all("SELECT * FROM drinks ORDER BY criado_em DESC", [], callback);
}

function buscarPorNome(nome, callback) {
  db.all(
    "SELECT * FROM drinks WHERE nome LIKE ? ORDER BY criado_em DESC",
    [`%${nome}%`],
    callback
  );
}

function buscarPorId(id, callback) {
  db.get("SELECT * FROM drinks WHERE id = ?", [id], callback);
}

function criarDrink(drink, callback) {
  const { nome, categoria, tipo, copo, instrucoes, imagem, usuario_id } = drink;

  db.run(
    `
    INSERT INTO drinks 
    (nome, categoria, tipo, copo, instrucoes, imagem, usuario_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [nome, categoria, tipo, copo, instrucoes, imagem, usuario_id],
    function (err) {
      callback(err, {
        id: this.lastID,
        ...drink,
      });
    }
  );
}

function atualizarDrink(id, drink, callback) {
  const { nome, categoria, tipo, copo, instrucoes, imagem } = drink;

  db.run(
    `
    UPDATE drinks
    SET nome = ?, categoria = ?, tipo = ?, copo = ?, instrucoes = ?, imagem = ?
    WHERE id = ?
    `,
    [nome, categoria, tipo, copo, instrucoes, imagem, id],
    function (err) {
      callback(err, {
        id,
        ...drink,
      });
    }
  );
}

function excluirDrink(id, callback) {
  db.run("DELETE FROM drinks WHERE id = ?", [id], callback);
}

module.exports = {
  listarTodos,
  buscarPorNome,
  buscarPorId,
  criarDrink,
  atualizarDrink,
  excluirDrink,
};