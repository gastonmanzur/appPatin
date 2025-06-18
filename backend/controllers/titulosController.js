const TituloIndividual = require('../models/TituloIndividual');
const TituloClub = require('../models/TituloClub');

// Crear título individual
exports.crearTituloIndividual = async (req, res) => {
  try {
    const { patinador, titulo, posicion, fecha, torneo } = req.body;
    const nuevoTitulo = new TituloIndividual({ patinador, titulo, posicion, fecha, torneo });
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
    const nuevoTitulo = new TituloClub({ titulo, posicion, fecha, torneo });
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
