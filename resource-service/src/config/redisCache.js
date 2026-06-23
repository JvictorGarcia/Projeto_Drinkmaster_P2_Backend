const { createClient } = require("redis");

const cacheClient = createClient({
  url: "redis://localhost:6379",
});

cacheClient.on("error", (err) => {
  console.error("Erro no Redis Cache:", err);
});

async function conectarCache() {
  if (!cacheClient.isOpen) {
    await cacheClient.connect();
    console.log("Resource Service conectado ao Redis Cache.");
  }
}

async function buscarCache(chave) {
  await conectarCache();

  const dados = await cacheClient.get(chave);

  if (!dados) {
    return null;
  }

  return JSON.parse(dados);
}

async function salvarCache(chave, valor, tempo = 60) {
  await conectarCache();

  await cacheClient.setEx(chave, tempo, JSON.stringify(valor));
}

async function limparCacheDrinks() {
  await conectarCache();

  await cacheClient.del("drinks:todos");
}

module.exports = {
  buscarCache,
  salvarCache,
  limparCacheDrinks,
};