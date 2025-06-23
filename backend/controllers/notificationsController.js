const Notification = require('../models/Notification');

exports.obtenerNotificaciones = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificaciones = await Notification.find({
      $or: [{ usuario: userId }, { usuario: null }]
    })
      .sort({ fecha: -1 })
      .populate('competencia');
    res.json(notificaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener notificaciones' });
  }
};

exports.marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const noti = await Notification.findById(id);
    if (!noti) return res.status(404).json({ msg: 'No encontrada' });
    if (noti.usuario && noti.usuario.toString() !== req.user.id)
      return res.status(403).json({ msg: 'No autorizada' });
    noti.leida = true;
    await noti.save();
    res.json({ msg: 'Notificación actualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar notificación' });
  }
};
