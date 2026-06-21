const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Erro no Redis Publisher:", err);
});

async function conectarRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Resource Service conectado ao Redis.");
  }
}

async function publicarEvento(tipo, dados) {
  await conectarRedis();

  const evento = {
    tipo,
    dados,
    data: new Date().toISOString(),
  };

  await redisClient.publish("drink-events", JSON.stringify(evento));

  console.log("Evento publicado:", evento);
}

module.exports = {
  publicarEvento,
};