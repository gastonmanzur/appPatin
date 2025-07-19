require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛡️ Cabeceras opcionales para mejorar compatibilidad con popups (Google Login)
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// ✅ Configuración CORS: dominios permitidos
const allowedOrigins = [
  'https://app-patin-ekcu.vercel.app',
  'https://app-patin-ekcu-gastonmanzurs-projects.vercel.app', // preview de Vercel
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
}));

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
