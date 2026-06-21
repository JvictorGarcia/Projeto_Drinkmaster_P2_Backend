const express = require("express");
const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");

const DrinkModel = require("../models/DrinkModel");
const autenticarToken = require("../config/authMiddleware");
const { publicarEvento } = require("../config/redisPublisher");

const router = express.Router();

function limparTexto(texto) {
    return sanitizeHtml(texto || "", {
        allowedTags: [],
        allowedAttributes: {},
    });
}

// Todas as rotas abaixo exigem JWT
router.use(autenticarToken);

// GET /drinks?nome=margarita
router.get("/", (req, res) => {
    const { nome } = req.query;

    const callback = (err, rows) => {
        if (err) {
            return res.status(500).json({ mensagem: "Erro ao buscar drinks." });
        }

        return res.json(rows);
    };

    if (nome) {
        return DrinkModel.buscarPorNome(limparTexto(nome), callback);
    }

    return DrinkModel.listarTodos(callback);
});

// POST /drinks
router.post(
    "/",
    [
        body("nome").notEmpty().withMessage("Nome é obrigatório."),
        body("categoria").notEmpty().withMessage("Categoria é obrigatória."),
        body("tipo").notEmpty().withMessage("Tipo é obrigatório."),
        body("copo").notEmpty().withMessage("Copo é obrigatório."),
        body("instrucoes").notEmpty().withMessage("Instruções são obrigatórias."),
    ],
    (req, res) => {
        const erros = validationResult(req);

        if (!erros.isEmpty()) {
            return res.status(400).json({
                mensagem: "Erro de validação.",
                erros: erros.array(),
            });
        }

        const drink = {
            nome: limparTexto(req.body.nome),
            categoria: limparTexto(req.body.categoria),
            tipo: limparTexto(req.body.tipo),
            copo: limparTexto(req.body.copo),
            instrucoes: limparTexto(req.body.instrucoes),
            imagem: limparTexto(req.body.imagem),
            usuario_id: req.usuario.id,
        };

        DrinkModel.criarDrink(drink, (err, novoDrink) => {
            if (err) {
                return res.status(500).json({ mensagem: "Erro ao criar drink." });
            }

            publicarEvento("drink.criado", novoDrink);

            return res.status(201).json({
                mensagem: "Drink criado com sucesso.",
                drink: novoDrink,
            });
        });
    }
);

// PUT /drinks/:id
router.put(
    "/:id",
    [
        body("nome").notEmpty().withMessage("Nome é obrigatório."),
        body("categoria").notEmpty().withMessage("Categoria é obrigatória."),
        body("tipo").notEmpty().withMessage("Tipo é obrigatório."),
        body("copo").notEmpty().withMessage("Copo é obrigatório."),
        body("instrucoes").notEmpty().withMessage("Instruções são obrigatórias."),
    ],
    (req, res) => {
        const { id } = req.params;
        const erros = validationResult(req);

        if (!erros.isEmpty()) {
            return res.status(400).json({
                mensagem: "Erro de validação.",
                erros: erros.array(),
            });
        }

        DrinkModel.buscarPorId(id, (err, drinkEncontrado) => {
            if (err) {
                return res.status(500).json({ mensagem: "Erro ao buscar drink." });
            }

            if (!drinkEncontrado) {
                return res.status(404).json({ mensagem: "Drink não encontrado." });
            }

            if (drinkEncontrado.usuario_id !== req.usuario.id) {
                return res.status(403).json({
                    mensagem: "Você não tem permissão para editar este drink.",
                });
            }

            const drinkAtualizado = {
                nome: limparTexto(req.body.nome),
                categoria: limparTexto(req.body.categoria),
                tipo: limparTexto(req.body.tipo),
                copo: limparTexto(req.body.copo),
                instrucoes: limparTexto(req.body.instrucoes),
                imagem: limparTexto(req.body.imagem),
            };

            DrinkModel.atualizarDrink(id, drinkAtualizado, (err, drink) => {
                if (err) {
                    return res.status(500).json({ mensagem: "Erro ao atualizar drink." });
                }

                publicarEvento("drink.atualizado", drink);

                return res.json({
                    mensagem: "Drink atualizado com sucesso.",
                    drink,
                });
            });
        });
    }
);

// DELETE /drinks/:id
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    DrinkModel.buscarPorId(id, (err, drinkEncontrado) => {
        if (err) {
            return res.status(500).json({ mensagem: "Erro ao buscar drink." });
        }

        if (!drinkEncontrado) {
            return res.status(404).json({ mensagem: "Drink não encontrado." });
        }

        if (drinkEncontrado.usuario_id !== req.usuario.id) {
            return res.status(403).json({
                mensagem: "Você não tem permissão para excluir este drink.",
            });
        }

        DrinkModel.excluirDrink(id, (err) => {
            if (err) {
                return res.status(500).json({ mensagem: "Erro ao excluir drink." });
            }

            publicarEvento("drink.excluido", {
                id,
            });

            return res.json({
                mensagem: "Drink excluído com sucesso.",
            });
        });
    });
});

module.exports = router;