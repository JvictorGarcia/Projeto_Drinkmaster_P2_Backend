const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    nome: "José Victor Garcia",
    email: "jose@email.com",
    senha: bcrypt.hashSync("123456", 10),
  },
  {
    id: 2,
    nome: "Usuário Teste",
    email: "teste@email.com",
    senha: bcrypt.hashSync("123456", 10),
  },
];

function findByEmail(email) {
  return users.find((user) => user.email === email);
}

module.exports = {
  findByEmail,
};