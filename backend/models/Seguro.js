const mongoose = require('mongoose');

const seguroSchema = new mongoose.Schema({
  dni: { type: String, required: true },
  cuil: { type: String },
  apellido: { type: String, required: true },
  nombres: { type: String, required: true },
  fechaNacimiento: { type: Date },
  sexo: { type: Number, enum: [1, 2] },
  nacionalidad: { type: String, default: 'Argentina' },
  club: { type: String, default: 'General Rodriguez' },
  funcion: { type: String, default: 'patinador' },
  codigoPostal: { type: String, default: '1748' },
  localidad: { type: String, default: 'General Rodriguez' },
  provincia: { type: String, default: 'Bs. As.' },
  telefono: { type: String },
  tipoLicSeg: { type: String, enum: ['SA', 'SD', 'LN'], default: 'SA' }
});

module.exports = mongoose.model('Seguro', seguroSchema);
