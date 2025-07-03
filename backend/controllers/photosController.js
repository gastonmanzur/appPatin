const Photo = require('../models/Photo');

exports.createPhoto = async (req, res) => {
  try {
    const imagen = req.file ? req.file.filename : null;
    if (!imagen) return res.status(400).json({ msg: 'Imagen requerida' });
    const photo = new Photo({ imagen, uploader: req.user.id });
    await photo.save();
    res.json({ msg: 'Foto subida correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al subir foto' });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const fotos = await Photo.find().sort({ fecha: -1 });
    res.json(fotos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener fotos' });
  }
};
