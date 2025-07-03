const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  imagen: { type: String, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photo', photoSchema);
