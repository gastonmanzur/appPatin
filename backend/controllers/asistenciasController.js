const Asistencia = require('../models/Asistencia');
const Patinador = require('../models/Patinador');

// Helper to apply increments/decrements to patinador asistencias
const applyCounts = async (detalles, fecha, factor) => {
  const year = new Date(fecha).getFullYear();
  for (const det of detalles) {
    const pat = await Patinador.findById(det.patinador);
    if (!pat) continue;
    let reg = pat.asistencias.find(a => a.year === year);
    if (!reg) {
      reg = { year, presentes: 0, ausentes: 0 };
      pat.asistencias.push(reg);
    }
    if (det.presente) {
      reg.presentes += factor;
    } else {
      reg.ausentes += factor;
    }
    await pat.save();
  }
};

exports.crearAsistencia = async (req, res) => {
  try {
    const { fecha = Date.now(), detalles } = req.body;
    const asistencia = new Asistencia({ fecha, tecnico: req.user.id, detalles });
    await asistencia.save();
    await applyCounts(detalles, fecha, 1);
    res.json({ msg: 'Asistencia registrada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al registrar asistencia' });
  }
};

exports.obtenerAsistencias = async (req, res) => {
  try {
    const asistencias = await Asistencia.find({ tecnico: req.user.id }).populate('detalles.patinador');
    res.json(asistencias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener asistencias' });
  }
};

exports.obtenerAsistencia = async (req, res) => {
  try {
    const asistencia = await Asistencia.findOne({ _id: req.params.id, tecnico: req.user.id }).populate('detalles.patinador');
    if (!asistencia) return res.status(404).json({ msg: 'Asistencia no encontrada' });
    res.json(asistencia);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener asistencia' });
  }
};

exports.actualizarAsistencia = async (req, res) => {
  try {
    const { fecha, detalles } = req.body;
    const asistencia = await Asistencia.findOne({ _id: req.params.id, tecnico: req.user.id });
    if (!asistencia) return res.status(404).json({ msg: 'Asistencia no encontrada' });
    await applyCounts(asistencia.detalles, asistencia.fecha, -1); // remove previous counts
    asistencia.fecha = fecha;
    asistencia.detalles = detalles;
    await asistencia.save();
    await applyCounts(detalles, fecha, 1);
    res.json({ msg: 'Asistencia actualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar asistencia' });
  }
};

exports.eliminarAsistencia = async (req, res) => {
  try {
    const asistencia = await Asistencia.findOneAndDelete({ _id: req.params.id, tecnico: req.user.id });
    if (!asistencia) return res.status(404).json({ msg: 'Asistencia no encontrada' });
    await applyCounts(asistencia.detalles, asistencia.fecha, -1);
    res.json({ msg: 'Asistencia eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar asistencia' });
  }
};
