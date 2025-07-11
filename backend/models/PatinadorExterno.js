const mongoose = require('mongoose');

const patinadorExternoSchema = new mongoose.Schema({
  numeroCorredor: { type: Number, required: true },
  nombre: { type: String, required: true },
  club: { type: String },
  categoria: { type: String }
});

patinadorExternoSchema.index({ numeroCorredor: 1, categoria: 1 }, { unique: true });

module.exports = mongoose.model('PatinadorExterno', patinadorExternoSchema);
