require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());

app.use(cors(corsOptions));

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/patinadores', require('./routes/patinadoresRoutes'));
app.use('/api/patinadores-externos', require('./routes/patinadoresExternosRoutes'));
app.use('/api/gestion-patinadores', require('./routes/gestionPatinadoresRoutes'));
app.use('/api/competencias', require('./routes/competenciasRoutes'));
app.use('/api/torneos', require('./routes/torneosRoutes'));
app.use('/api/ranking', require('./routes/rankingRoutes'));
app.use('/api/titulos', require('./routes/titulosRoutes'));
app.use('/api/notificaciones', require('./routes/notificationRoutes'));
app.use('/api/usuarios', require('./routes/userRoutes'));
app.use('/api/seguros', require('./routes/segurosRoutes'));
app.use('/api/informes', require('./routes/informesRoutes'));
app.use('/api/fotos', require('./routes/photoRoutes'));
app.use('/api/asistencias', require('./routes/asistenciasRoutes'));




// DB y servidor
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
