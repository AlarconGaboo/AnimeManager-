const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8000;

// Middleware para manejar JSON
app.use(express.json());

// Leer el archivo anime.json
const getAnimes = () => {
  const data = fs.readFileSync('anime.json', 'utf-8');
  return JSON.parse(data);
};

// Guardar los cambios en anime.json
const saveAnimes = (animes) => {
  fs.writeFileSync('anime.json', JSON.stringify(animes, null, 2));
};

// Listar todos los animes
app.get('/animes', (req, res) => {
  const animes = getAnimes();
  res.json(animes);
});

// Leer un anime por id
app.get('/animes/:id', (req, res) => {
  const animes = getAnimes();
  const anime = animes[req.params.id];

  if (!anime) {
    return res.status(404).json({ message: 'Anime no encontrado.' });
  }

  res.json(anime);
});

// Leer un anime por nombre
app.get('/animes/nombre/:nombre', (req, res) => {
  const animes = getAnimes();
  const anime = Object.values(animes).find(a => a.nombre.toLowerCase() === req.params.nombre.toLowerCase());

  if (!anime) {
    return res.status(404).json({ message: 'Anime no encontrado.' });
  }

  res.json(anime);
});

// Agregar un nuevo anime
app.post('/animes', (req, res) => {
  const animes = getAnimes();
  const newId = String(Object.keys(animes).length + 1);
  animes[newId] = req.body;

  saveAnimes(animes);
  res.status(201).json({ message: 'Anime agregado.', id: newId });
});

// Editar un anime existente
app.put('/animes/:id', (req, res) => {
  const animes = getAnimes();
  const id = req.params.id;

  if (!animes[id]) {
    return res.status(404).json({ message: 'Anime no encontrado.' });
  }

  animes[id] = req.body;
  saveAnimes(animes);
  res.json({ message: 'Anime actualizado.' });
});

// Eliminar un anime
app.delete('/animes/:id', (req, res) => {
  const animes = getAnimes();
  const id = req.params.id;

  if (!animes[id]) {
    return res.status(404).json({ message: 'Anime no encontrado.' });
  }

  delete animes[id];
  saveAnimes(animes);
  res.json({ message: 'Anime eliminado.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
