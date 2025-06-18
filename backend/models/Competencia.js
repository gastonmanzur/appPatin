const mongoose = require('mongoose');

const resultadoSchema = new mongoose.Schema({
  patinador: { type: mongoose.Schema.Types.ObjectId, ref: 'Patinador', required: true },
  posicion: { type: Number, required: true }, // 1, 2, 3, etc
  puntos: { type: Number, required: true }
});

const competenciaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha: { type: Date, required: true },
  resultados: [resultadoSchema],
  resultadosClub: [{ 
    club: { type: String, required: true },
    puntos: { type: Number, required: true }
  }]
});

module.exports = mongoose.model('Competencia', competenciaSchema);
