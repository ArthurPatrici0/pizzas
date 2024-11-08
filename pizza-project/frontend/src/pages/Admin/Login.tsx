import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/login", { // URL do novo endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, senha }),
      });

      const data = await response.json(); // Captura a resposta da API

      if (!response.ok) {
        setError(data.message); // Atualiza o estado de erro com a mensagem da API
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      navigate("/admin");
    } catch (error) {
      setError("Ocorreu um erro ao tentar fazer login."); 
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        bgcolor: "#f5f5f5",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
          padding: 4,
        }}
      >
        <CssBaseline />
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">Login</Typography>

        {error && <Alert severity="error" sx={{ width: "100%", mb: 2 }}>{error}</Alert>} {/* Exibe a mensagem de erro */}

        <Box sx={{ mt: 1, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="Login"
            name="login"
            autoFocus
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
              setError("");
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="senha"
            name="senha"
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setError("");
            }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
