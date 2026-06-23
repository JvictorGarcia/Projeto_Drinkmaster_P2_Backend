import axios from "axios";

const AUTH_URL = "http://localhost:3001/auth";
const RESOURCE_URL = "http://localhost:3002/drinks";

export async function loginUsuario(email, senha) {
  const resposta = await axios.post(`${AUTH_URL}/login`, {
    email,
    senha,
  });

  return resposta.data;
}

export async function listarDrinks(token) {
  const resposta = await axios.get(RESOURCE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return resposta.data;
}

export async function buscarDrinksBackend(nome, token) {
  const resposta = await axios.get(`${RESOURCE_URL}?nome=${nome}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return resposta.data;
}

export async function criarDrink(drink, token) {
  const resposta = await axios.post(RESOURCE_URL, drink, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return resposta.data;
}

export async function atualizarDrink(id, drink, token) {
  const resposta = await axios.put(`${RESOURCE_URL}/${id}`, drink, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return resposta.data;
}

export async function excluirDrink(id, token) {
  const resposta = await axios.delete(`${RESOURCE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return resposta.data;
}
export async function buscarImagemCocktail(nome) {
  const resposta = await axios.get(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nome}`
  );

  const drinkEncontrado = resposta.data.drinks?.[0];

  return drinkEncontrado?.strDrinkThumb || "";
}
export async function logoutUsuario(token) {
  const resposta = await axios.post(
    "http://localhost:3001/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return resposta.data;
}