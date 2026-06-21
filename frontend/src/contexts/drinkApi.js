import axios from "axios";

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";  // API pública TheCocktailDB

export async function buscarDrinksPorNome(nome) {
  const resposta = await axios.get(`${API_URL}/search.php`, {
    params: {
      s: nome,
    },
  });
  // Se encontrar drinks, retorna a lista
  // Se não encontrar, retorna uma lista vazia
  return resposta.data.drinks || [];
}