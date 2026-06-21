const express = require("express");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();
require("./src/config/database");

const drinkRoutes = require("./src/routes/drinkRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

app.get("/", (req, res) => {
  res.json({
    mensagem: "Resource Service funcionando!",
  });
});

app.use("/drinks", drinkRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Resource Service rodando na porta ${PORT}`);
});