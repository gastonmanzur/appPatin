const mongoose = require('mongoose');

const tituloIndividualSchema = new mongoose.Schema({
  patinador: { type: mongoose.Schema.Types.ObjectId, ref: 'Patinador', required: true },
  titulo: { type: String, required: true },
  posicion: { type: Number },
  fecha: { type: Date, required: true },
  torneo: { type: String },
  imagen: { type: String }
});

module.exports = mongoose.model('TituloIndividual', tituloIndividualSchema);
