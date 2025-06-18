const mongoose = require('mongoose');

const patinadorSchema = new mongoose.Schema({
  primerNombre: { type: String, required: true },
  segundoNombre: { type: String },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true },
  fechaNacimiento: { type: Date, required: true },
  dni: { type: String, required: true, unique: true },
  cuil: { type: String },
  direccion: { type: String },
  dniMadre: { type: String },
  dniPadre: { type: String },
  telefono: { type: String },
  sexo: { type: String, enum: ['M', 'F'], required: true },
  nivel: { type: String, enum: ['Federado', 'Intermedia', 'Transicion', 'Escuela'], required: true },
  numeroCorredor: { type: Number },
  categoria: { type: String },
  foto: { type: String },
  fotoRostro: { type: String }
});

module.exports = mongoose.model('Patinador', patinadorSchema);
