import { useEffect, useState } from "react";
import { Alert, Box } from "@mui/material";

export default function NotificationListener() {
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3003");

    socket.onopen = () => {
      console.log("Conectado ao WebSocket");
    };

    socket.onmessage = (event) => {
      const dados = JSON.parse(event.data);

      if (dados.tipo === "drink.criado") {
        setMensagem("Novo drink cadastrado!");
      }

      if (dados.tipo === "drink.atualizado") {
        setMensagem("Um drink foi atualizado!");
      }

      if (dados.tipo === "drink.excluido") {
        setMensagem("Um drink foi excluído!");
      }

      setTimeout(() => {
        setMensagem("");
      }, 4000);
    };

    socket.onerror = () => {
      console.log("Erro na conexão WebSocket");
    };

    return () => {
      socket.close();
    };
  }, []);

  if (!mensagem) return null;

  return (
    <Box sx={{ position: "fixed", top: 80, right: 20, zIndex: 9999 }}>
      <Alert severity="info">{mensagem}</Alert>
    </Box>
  );
}