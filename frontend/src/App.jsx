import { AppBar, Box, Button, CssBaseline, Toolbar, Typography } from "@mui/material";
import DrinkSearch from "./components/DrinkSearch";
import NotificationListener from "./components/NotificationListener";
import Login from "./components/Login";
import { useDrink } from "./contexts/DrinkContext";

function App() {
  const { usuario, logout } = useDrink();

  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #141e30, #243b55)",
          color: "white",
          pb: 5,
        }}
      >
        <AppBar position="static" sx={{ background: "#111" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5">🍹 DrinkMaster</Typography>

            {usuario && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body2">{usuario.nome}</Typography>
                <Button color="warning" variant="outlined" onClick={logout}>
                  Sair
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {usuario ? (
          <>
            <NotificationListener />
            <DrinkSearch />
          </>
        ) : (
          <Login />
        )}

        <Box
          sx={{
            mt: 10,
            pt: 4,
            pb: 3,
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            color: "#d6d6d6",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            🍹 DrinkMaster
          </Typography>

          <Typography variant="body2" sx={{ mt: 1 }}>
            Projeto Fullstack com React, Express, JWT, SQLite, Redis e WebSocket.
          </Typography>

          <Typography variant="body2" sx={{ mt: 2, color: "#ffb74d" }}>
            Desenvolvido por José Victor Garcia.
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default App;