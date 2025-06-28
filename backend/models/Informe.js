const mongoose = require('mongoose');

const informeSchema = new mongoose.Schema({
  patinador: { type: mongoose.Schema.Types.ObjectId, ref: 'Patinador', required: true },
  tecnico: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contenido: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Informe', informeSchema);
