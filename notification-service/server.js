const express = require("express");
const cors = require("cors");
const { createClient } = require("redis");
const WebSocket = require("ws");
require("dotenv").config();

const app = express();

app.use(cors());

const server = app.listen(process.env.PORT, () => {
  console.log(`Notification Service rodando na porta ${process.env.PORT}`);
});

const wss = new WebSocket.Server({ server });

const redisSubscriber = createClient({
  url: process.env.REDIS_URL,
});

redisSubscriber.on("error", (err) => {
  console.error("Erro Redis Subscriber:", err);
});

async function iniciarRedis() {
  await redisSubscriber.connect();

  console.log("Notification Service conectado ao Redis.");

  await redisSubscriber.subscribe("drink-events", (mensagem) => {
    console.log("Evento recebido:", mensagem);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(mensagem);
      }
    });
  });
}

iniciarRedis();

app.get("/", (req, res) => {
  res.json({
    mensagem: "Notification Service funcionando!",
  });
});