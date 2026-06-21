import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { DrinkProvider } from "./contexts/DrinkContext.jsx"; 

//O React pega a div root do HTML e renderiza toda a aplicação dentro dela

ReactDOM.createRoot(document.getElementById("root")).render(// Provider disponibiliza os dados globais da aplicação para todos os componentes
  <React.StrictMode>
    <DrinkProvider>
      <App />
    </DrinkProvider>
  </React.StrictMode>
);