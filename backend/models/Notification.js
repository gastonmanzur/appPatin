const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  competencia: { type: mongoose.Schema.Types.ObjectId, ref: 'Competencia', default: null },
  mensaje: { type: String, required: true },
  leidosPor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
