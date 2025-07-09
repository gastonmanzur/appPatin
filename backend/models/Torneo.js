const mongoose = require('mongoose');

const torneoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  fechaInicio: Date,
  fechaFin: Date,
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  competencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competencia' }]
});

module.exports = mongoose.model('Torneo', torneoSchema);
