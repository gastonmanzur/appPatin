const User = require('../models/User');

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('nombre apellido email role picture googleId');
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener usuario' });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No se subió ninguna imagen' });
    await User.findByIdAndUpdate(req.user.id, { picture: req.file.filename });
    res.json({ msg: 'Foto de perfil actualizada', picture: req.file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar foto de perfil' });
  }
};
