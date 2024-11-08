import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Snackbar,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

interface Ingrediente {
  nome: string;
  grama: string;
  imagem: string;
}

interface Pizza {
  id: string;
  nome: string;
  valor: string;
  descricao: string;
  calorias: string;
  imagem: string; // Apenas o nome da imagem
  ingredientes: Ingrediente[];
}

const Admin: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [editingPizza, setEditingPizza] = useState<Partial<Pizza> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  {/*const [newIngredient, setNewIngredient] = useState<Ingrediente>({
    nome: "",
    grama: "",
    imagem: "",
  });*/}
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const imageDirectory = '/server/images/'; // Diretório onde as imagens estão armazenadas

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const response = await fetch('http://localhost:5000/pizzas');
      const data = await response.json();
      setPizzas(data);
    } catch (error) {
      console.error('Erro ao buscar pizzas:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingPizza({ ...editingPizza, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);

      // Para mostrar uma prévia da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrEditPizza = async () => {
    if (!editingPizza?.nome || !editingPizza?.valor || !editingPizza?.descricao || !editingPizza?.calorias) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const formData = new FormData();
    formData.append('nome', editingPizza.nome || "");
    formData.append('valor', editingPizza.valor || "");
    formData.append('descricao', editingPizza.descricao || "");
    formData.append('calorias', editingPizza.calorias || "");
    if (imageFile) {
      formData.append('imagem', imageFile);
    }

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `http://localhost:5000/pizzas/${editingPizza.id}` : 'http://localhost:5000/pizzas';

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        if (isEditing) {
          setPizzas(prev => prev.map(pizza => (pizza.id === data.id ? data : pizza)));
        } else {
          setPizzas(prev => [...prev, data]);
        }
        setEditingPizza(null);
        setIsEditing(false);
        setImageFile(null); // Limpa o campo de imagem após salvar
        setImagePreview(''); // Limpa a prévia da imagem
        setSnackbarMessage("Pizza salva com sucesso!");
      } else {
        throw new Error(data.message || "Erro ao salvar pizza.");
      }
    } catch (error) {
      console.error('Erro ao salvar pizza:', error);
      setSnackbarMessage("Erro ao salvar pizza.");
    }
    setSnackbarOpen(true);
  };

  const handleEditClick = (pizza: Pizza) => {
    setEditingPizza(pizza);
    setIsEditing(true);
    setImageFile(null); // Limpa o campo de imagem
    setImagePreview(`${imageDirectory}${pizza.imagem}`); // Define a imagem existente para visualização
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta pizza?")) {
      try {
        await fetch(`http://localhost:5000/pizzas/${id}`, {
          method: 'DELETE',
        });
        setPizzas(prev => prev.filter(pizza => pizza.id !== id));
      } catch (error) {
        console.error('Erro ao deletar pizza:', error);
      }
    }
  };

  {/*const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient({ ...newIngredient, [name]: value });
  };

  const handleAddIngredient = () => {
    if (newIngredient.nome && newIngredient.grama && newIngredient.imagem) {
      setEditingPizza((prev) => ({
        ...prev,
        ingredientes: [...(prev?.ingredientes || []), newIngredient],
      }));
      setNewIngredient({ nome: "", grama: "", imagem: "" });
    } else {
      alert("Preencha todos os campos do ingrediente!");
    }
  };

  const handleDeleteIngredient = (index: number) => {
    setEditingPizza((prev) => ({
      ...prev,
      ingredientes: prev?.ingredientes?.filter((_, i) => i !== index) || [],
    }));
  };*/}

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}
      >
        Logout
      </Button>
      <Container
        sx={{
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          bgcolor: "#e3f2fd",
        }}
        maxWidth={false}
      >
        <Box 
          sx={{ 
            backgroundColor: 'rgba(169, 169, 169, 0.7)', // Cor de fundo escura com opacidade
            borderRadius: '8px', // Bordas arredondadas
            padding: 4, // Espaçamento interno
            width: '100%', // Largura total do contêiner
            maxWidth: 1000 // Largura máxima
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: 'black' }}>
            Gerenciamento de Pizzas
          </Typography>

          <Box sx={{ mb: 3, width: "100%", maxWidth: 1000}}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="nome"
                  value={editingPizza?.nome || ""}
                  onChange={handleInputChange}
                  margin="normal"
                  sx={{ bgcolor: "#e3f2fd" }}
                />
                <TextField
                  fullWidth
                  label="Valor"
                  name="valor"
                  value={editingPizza?.valor || ""}
                  onChange={handleInputChange}
                  margin="normal"
                  sx={{ bgcolor: "#e3f2fd" }}
                />
                <TextField
                  fullWidth
                  label="Descrição"
                  name="descricao"
                  value={editingPizza?.descricao || ""}
                  onChange={handleInputChange}
                  margin="normal"
                  sx={{ bgcolor: "#e3f2fd" }}
                />
                <TextField
                  fullWidth
                  label="Calorias"
                  name="calorias"
                  value={editingPizza?.calorias || ""}
                  onChange={handleInputChange}
                  margin="normal"
                  sx={{ bgcolor: "#e3f2fd" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddOrEditPizza}
                  sx={{ mt: 3 }}
                >
                  {isEditing ? "Atualizar Pizza" : "Adicionar Pizza"}
                </Button>
              </Grid>
              
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ mt: 2, color: 'black' }}>Imagem</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ marginTop: 16, color: 'black' }}
                  />
                  {/* Renderiza a imagem em pequena escala */}
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" sx={{ color: 'black' }}>Imagem atual:</Typography>
                      <img
                        src={imagePreview}
                        alt="Imagem da Pizza"
                        style={{ width: '100px', height: 'auto' }} // Ajuste a escala aqui
                      />
                    </Box>
                  )}
                </Grid>
              
              {/*
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
                  Ingredientes
                </Typography>
                <TextField
                  fullWidth
                  label="Nome do Ingrediente"
                  name="nome"
                  value={newIngredient.nome}
                  onChange={handleIngredientChange}
                  margin="normal"
                  sx={{ bgcolor: "#e3f2fd" }}
                />
                <TextField
                  fullWidth
                  label="Gramas"
                  name="grama"
                  value={newIngredient.grama}
                  onChange={handleIngredientChange}
                  margin="normal"
                  sx={{ bgcolor: "#e3f2fd" }}
                />
                <TextField
                  fullWidth
                  label="Imagem"
                  name="imagem"
                  value={newIngredient.imagem}
                  onChange={handleIngredientChange}
                  margin="normal"
                  sx={{ bgcolor: "#e3f2fd" }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddIngredient}
                  sx={{ mt: 3 }}
                >
                  Adicionar Ingrediente
                </Button>

                Tabela de Ingredientes 
                {editingPizza?.ingredientes && editingPizza?.ingredientes.length > 0 && (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nome</TableCell>
                          <TableCell>Gramas</TableCell>
                          <TableCell>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {editingPizza.ingredientes.map((ingrediente, index) => (
                          <TableRow key={index}>
                            <TableCell>{ingrediente.nome}</TableCell>
                            <TableCell>{ingrediente.grama}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleDeleteIngredient(index)}>
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>*/}
            </Grid>
          </Box>
        </Box>

        {/* Tabela de Pizzas */}
        <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
          Lista de Pizzas
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Calorias</TableCell>
                <TableCell>Imagem</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pizzas.map((pizza) => (
                <TableRow key={pizza.id}>
                  <TableCell>{pizza.nome}</TableCell>
                  <TableCell>{pizza.valor}</TableCell>
                  <TableCell>{pizza.descricao}</TableCell>
                  <TableCell>{pizza.calorias}</TableCell>
                  <TableCell>
                    <img 
                      src={`${imageDirectory}${pizza.imagem}`} 
                      alt={`${pizza.nome} imagem`} 
                      style={{ width: '50px', height: 'auto' }} // Exibe a imagem da pizza
                      />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(pizza)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(pizza.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Admin;
