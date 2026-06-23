const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const rateLimit = require("express-rate-limit");
const blacklist = require("../config/tokenBlacklist");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    mensagem: "Muitas tentativas de login. Tente novamente mais tarde.",
  },
});

// Logout: adiciona o token na blacklist
router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({
      mensagem: "Token não informado.",
    });
  }

  const token = authHeader.split(" ")[1];

  blacklist.add(token);

  console.log("[auth-service] Logout realizado.");

  return res.json({
    mensagem: "Logout realizado com sucesso.",
  });
});

// Login com limite de tentativas
router.post("/login", loginLimiter, (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "Email e senha são obrigatórios.",
    });
  }

  const user = UserModel.findByEmail(email);

  if (!user) {
    console.log("[auth-service] Tentativa de login inválida:", email);

    return res.status(401).json({
      mensagem: "Usuário ou senha inválidos.",
    });
  }

  const senhaValida = bcrypt.compareSync(senha, user.senha);

  if (!senhaValida) {
    console.log("[auth-service] Tentativa de login inválida:", email);

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

  console.log("[auth-service] Login realizado:", user.email);

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