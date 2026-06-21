import { createContext, useContext, useState } from "react";

const DrinkContext = createContext();

export function DrinkProvider({ children }) {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuario")) || null
  );

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  function salvarLogin(dados) {
    setUsuario(dados.usuario);
    setToken(dados.token);

    localStorage.setItem("usuario", JSON.stringify(dados.usuario));
    localStorage.setItem("token", dados.token);
  }

  function logout() {
    setUsuario(null);
    setToken("");
    setDrinks([]);

    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }

  return (
    <DrinkContext.Provider
      value={{
        drinks,
        setDrinks,
        loading,
        setLoading,
        erro,
        setErro,
        usuario,
        token,
        salvarLogin,
        logout,
      }}
    >
      {children}
    </DrinkContext.Provider>
  );
}

export function useDrink() {
  return useContext(DrinkContext);
}