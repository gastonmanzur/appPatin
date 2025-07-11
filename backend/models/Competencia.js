const mongoose = require('mongoose');

const resultadoSchema = new mongoose.Schema({
  patinador: { type: mongoose.Schema.Types.ObjectId, ref: 'Patinador' },
  numeroCorredor: { type: Number },
  nombre: { type: String },
  club: { type: String },
  categoria: { type: String },
  posicion: { type: Number, required: true }, // 1, 2, 3, etc
  puntos: { type: Number, required: true }
});

const competenciaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  fecha: { type: Date, required: true },
  clubOrganizador: { type: String },
  torneo: { type: mongoose.Schema.Types.ObjectId, ref: 'Torneo' },
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resultados: [resultadoSchema],
  resultadosClub: [{
    club: { type: String, required: true },
    puntos: { type: Number, required: true }
  }],
  listaBuenaFe: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  listaBuenaFeManual: [{
    patinador: { type: mongoose.Schema.Types.ObjectId, ref: 'Patinador' },
    baja: { type: Boolean, default: false }
  }],
  bajas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patinador' }],
  padronSeguros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Competencia', competenciaSchema);
