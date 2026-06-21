import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { loginUsuario } from "../contexts/backendApi";
import { useDrink } from "../contexts/DrinkContext";

export default function Login() {
  const [email, setEmail] = useState("jose@email.com");
  const [senha, setSenha] = useState("123456");
  const [erroLogin, setErroLogin] = useState("");

  const { salvarLogin } = useDrink();

  async function entrar() {
    if (!email || !senha) {
      setErroLogin("Informe email e senha.");
      return;
    }

    try {
      setErroLogin("");

      const dados = await loginUsuario(email, senha);

      salvarLogin(dados);
    } catch {
      setErroLogin("Email ou senha inválidos.");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: 380,
          p: 2,
          borderRadius: 4,
          background: "#1e1e1e",
          color: "white",
          boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
        }}
      >
        <CardContent>
          <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
            Login
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, textAlign: "center" }}>
            Acesse o DrinkMaster Fullstack
          </Typography>

          {erroLogin && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erroLogin}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2, background: "white", borderRadius: 1 }}
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            sx={{ mb: 3, background: "white", borderRadius: 1 }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={entrar}
            sx={{
              background: "#ff9800",
              fontWeight: 700,
              "&:hover": {
                background: "#f57c00",
              },
            }}
          >
            Entrar
          </Button>

          <Typography variant="body2" sx={{ mt: 2, color: "#ccc" }}>
            Usuário teste: jose@email.com / 123456
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}