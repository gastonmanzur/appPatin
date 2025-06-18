const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  imagen: { type: String },
autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema);
