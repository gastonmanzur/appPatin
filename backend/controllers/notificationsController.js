const Notification = require('../models/Notification');

exports.obtenerNotificaciones = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificaciones = await Notification.find({
      $or: [{ usuario: userId }, { usuario: null }]
    })
      .sort({ fecha: -1 })
      .populate('competencia')
      .lean();
    const result = notificaciones.map(n => ({
      ...n,
      leida: Array.isArray(n.leidosPor)
        ? n.leidosPor.some(u => u.toString() === userId)
        : false
    }));
    res.json(result);
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
    if (!noti.leidosPor.some(u => u.toString() === req.user.id)) {
      noti.leidosPor.push(req.user.id);
      await noti.save();
    }
    res.json({ msg: 'Notificación actualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar notificación' });
  }
};

exports.crearNotificacion = async (req, res) => {
  try {
    const { mensaje } = req.body;
    if (!mensaje) return res.status(400).json({ msg: 'Mensaje requerido' });
    await Notification.create({ mensaje, usuario: null });
    res.json({ msg: 'Notificación creada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear notificación' });
  }
};

