const Notification = require('../models/Notification');

exports.obtenerNotificaciones = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificaciones = await Notification.find({
      $or: [{ usuario: userId }, { usuario: null }]
    }).sort({ fecha: -1 });
    res.json(notificaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener notificaciones' });
  }
};
