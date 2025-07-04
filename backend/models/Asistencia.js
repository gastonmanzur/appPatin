const mongoose = require('mongoose');

const detalleSchema = new mongoose.Schema({
  patinador: { type: mongoose.Schema.Types.ObjectId, ref: 'Patinador', required: true },
  presente: { type: Boolean, required: true }
});

const asistenciaSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  tecnico: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  detalles: [detalleSchema]
});

module.exports = mongoose.model('Asistencia', asistenciaSchema);
