const TituloIndividual = require('../models/TituloIndividual');
const TituloClub = require('../models/TituloClub');

// Crear título individual
exports.crearTituloIndividual = async (req, res) => {
  try {
    const { patinador, titulo, posicion, fecha, torneo } = req.body;
    const imagen = req.file ? req.file.filename : undefined;
    const nuevoTitulo = new TituloIndividual({ patinador, titulo, posicion, fecha, torneo, imagen });
    await nuevoTitulo.save();
    res.json({ msg: 'Título individual guardado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al guardar título individual' });
  }
};

// Listar títulos individuales
exports.listarTitulosIndividuales = async (req, res) => {
  try {
    const titulos = await TituloIndividual.find().populate('patinador');
    res.json(titulos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener títulos individuales' });
  }
};

// Crear título de club
exports.crearTituloClub = async (req, res) => {
  try {
    const { titulo, posicion, fecha, torneo } = req.body;
    const imagen = req.file ? req.file.filename : undefined;
    const nuevoTitulo = new TituloClub({ titulo, posicion, fecha, torneo, imagen });
    await nuevoTitulo.save();
    res.json({ msg: 'Título de club guardado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al guardar título de club' });
  }
};

// Listar títulos de club
exports.listarTitulosClub = async (req, res) => {
  try {
    const titulos = await TituloClub.find();
    res.json(titulos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener títulos de club' });
  }
};

// Editar título individual
exports.editarTituloIndividual = async (req, res) => {
  try {
    const { id } = req.params;
    const { patinador, titulo, posicion, fecha, torneo } = req.body;
    const updateData = { patinador, titulo, posicion, fecha, torneo };
    if (req.file) updateData.imagen = req.file.filename;
    await TituloIndividual.findByIdAndUpdate(id, updateData);
    res.json({ msg: 'Título individual actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar título individual' });
  }
};

// Eliminar título individual
exports.eliminarTituloIndividual = async (req, res) => {
  try {
    const { id } = req.params;
    await TituloIndividual.findByIdAndDelete(id);
    res.json({ msg: 'Título individual eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar título individual' });
  }
};

// Editar título de club
exports.editarTituloClub = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, posicion, fecha, torneo } = req.body;
    const updateData = { titulo, posicion, fecha, torneo };
    if (req.file) updateData.imagen = req.file.filename;
    await TituloClub.findByIdAndUpdate(id, updateData);
    res.json({ msg: 'Título de club actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar título de club' });
  }
};

// Eliminar título de club
exports.eliminarTituloClub = async (req, res) => {
  try {
    const { id } = req.params;
    await TituloClub.findByIdAndDelete(id);
    res.json({ msg: 'Título de club eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar título de club' });
  }
};
