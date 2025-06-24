const Seguro = require('../models/Seguro');

exports.crearSolicitud = async (req, res) => {
  try {
    const datos = req.body;
    const nuevo = new Seguro(datos);
    await nuevo.save();
    res.json({ msg: 'Solicitud de seguro guardada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al guardar solicitud' });
  }
};
