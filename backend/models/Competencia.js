const mongoose = require('mongoose');

const resultadoSchema = new mongoose.Schema({
  patinador: { type: mongoose.Schema.Types.ObjectId, ref: 'Patinador' },
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
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resultados: [resultadoSchema],
  resultadosClub: [{
    club: { type: String, required: true },
    puntos: { type: Number, required: true }
  }],
  listaBuenaFe: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  padronSeguros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Competencia', competenciaSchema);
