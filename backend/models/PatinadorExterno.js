const mongoose = require('mongoose');

const patinadorExternoSchema = new mongoose.Schema({
  numeroCorredor: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  club: { type: String }
});

module.exports = mongoose.model('PatinadorExterno', patinadorExternoSchema);
