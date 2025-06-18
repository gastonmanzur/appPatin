const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
   picture: { type: String },
  role: { type: String, enum: ['Deportista', 'Tecnico', 'Delegado'], default: 'Deportista' },
  patinadoresAsociados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patinador' }],
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
});

module.exports = mongoose.model('User', userSchema);
