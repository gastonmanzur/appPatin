const mongoose = require('mongoose');

const tituloClubSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  posicion: { type: Number },
  fecha: { type: Date, required: true },
  torneo: { type: String },
  imagen: { type: String }
});

module.exports = mongoose.model('TituloClub', tituloClubSchema);
