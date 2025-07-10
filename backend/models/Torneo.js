const mongoose = require('mongoose');

const torneoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  fechaInicio: Date,
  fechaFin: Date,
  tipo: { type: String, enum: ['Nacional', 'Metropolitano', 'Otro'], default: 'Otro' },
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  competencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competencia' }],
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Torneo', torneoSchema);
