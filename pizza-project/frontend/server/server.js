const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const dataFilePath = path.join(__dirname, 'bd.json');

// Configuração do multer para armazenar as imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/images/')); // Alterar o caminho se necessário
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Manter o nome original do arquivo
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());

// Função para ler o arquivo JSON
const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Função para escrever no arquivo JSON
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.post('/login', (req, res) => {
  const { login, senha } = req.body;
  const usuarios = readData().usuarios;

  const userExists = usuarios.some(user => user.login === login && user.senha === senha);

  if (userExists) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Usuário ou senha inválidos" });
  }
});

app.get('/pizzas', (req, res) => {
  const pizzas = readData().pizzas;
  res.json(pizzas);
});

// Rota para adicionar uma nova pizza
app.post('/pizzas', upload.single('imagem'), (req, res) => {
  const { nome, valor, descricao, calorias } = req.body;
  const imagem = req.file ? req.file.originalname : ''; // Pega o nome do arquivo da imagem

  const newPizza = { id: Date.now().toString(), nome, valor, descricao, calorias, imagem };
  const data = readData();
  data.pizzas.push(newPizza);
  writeData(data);
  res.status(201).json(newPizza);
});

// Rota para editar uma pizza existente
app.put('/pizzas/:id', upload.single('imagem'), (req, res) => {
  const { id } = req.params;
  const { nome, valor, descricao, calorias } = req.body;
  const imagem = req.file ? req.file.originalname : ''; // Pega o nome do arquivo da imagem, se houver

  const data = readData();
  const pizzaIndex = data.pizzas.findIndex(pizza => pizza.id === id);

  if (pizzaIndex === -1) {
    return res.status(404).send('Pizza not found');
  }

  // Atualiza os campos da pizza
  data.pizzas[pizzaIndex] = {
    ...data.pizzas[pizzaIndex],
    nome,
    valor,
    descricao,
    calorias,
    imagem: imagem || data.pizzas[pizzaIndex].imagem // Mantém a imagem anterior se nenhuma nova for enviada
  };

  writeData(data);
  res.json(data.pizzas[pizzaIndex]);
});

// Rota para deletar uma pizza
app.delete('/pizzas/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  const newPizzas = data.pizzas.filter(pizza => pizza.id !== id);

  if (newPizzas.length === data.pizzas.length) {
    return res.status(404).send('Pizza not found');
  }

  data.pizzas = newPizzas;
  writeData(data);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
