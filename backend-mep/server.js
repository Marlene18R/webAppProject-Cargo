const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const requestRoutes = require('./routes/requestRoutes');
const catalogRoutes = require('./routes/catalogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/support-requests', requestRoutes);
app.use('/api', catalogRoutes);

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('API de Mi Escuela Primero funcionando ');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
