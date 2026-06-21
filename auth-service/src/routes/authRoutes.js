const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "Email e senha são obrigatórios.",
    });
  }

  const user = UserModel.findByEmail(email);

  if (!user) {
    return res.status(401).json({
      mensagem: "Usuário ou senha inválidos.",
    });
  }

  const senhaValida = bcrypt.compareSync(senha, user.senha);

  if (!senhaValida) {
    return res.status(401).json({
      mensagem: "Usuário ou senha inválidos.",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      nome: user.nome,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return res.json({
    mensagem: "Login realizado com sucesso.",
    token,
    usuario: {
      id: user.id,
      nome: user.nome,
      email: user.email,
    },
  });
});

module.exports = router;