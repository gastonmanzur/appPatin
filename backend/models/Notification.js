const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  competencia: { type: mongoose.Schema.Types.ObjectId, ref: 'Competencia', default: null },
  mensaje: { type: String, required: true },
  leida: { type: Boolean, default: false },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
