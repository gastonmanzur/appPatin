const Informe = require('../models/Informe');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.crearInforme = async (req, res) => {
  try {
    const { patinador, contenido } = req.body;
    const informe = new Informe({ patinador, contenido, tecnico: req.user.id });
    await informe.save();

    try {
      const usuarios = await User.find({ patinadoresAsociados: patinador });
      for (const u of usuarios) {
        await Notification.create({
          usuario: u._id,
          mensaje: 'Nuevo informe de progreso disponible'
        });
      }
    } catch (e) {
      console.error('Error al crear notificaciones de informe', e);
    }

    res.json({ msg: 'Informe creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear informe' });
  }
};

exports.obtenerInformesPorPatinador = async (req, res) => {
  try {
    const { id } = req.params;
    const informes = await Informe.find({ patinador: id })
      .sort({ fecha: -1 })
      .populate('tecnico', 'nombre apellido');
    res.json(informes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener informes' });
  }
};

exports.editarInforme = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;
    await Informe.findByIdAndUpdate(id, { contenido });
    res.json({ msg: 'Informe actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar informe' });
  }
};

exports.eliminarInforme = async (req, res) => {
  try {
    const { id } = req.params;
    await Informe.findByIdAndDelete(id);
    res.json({ msg: 'Informe eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar informe' });
  }
};
