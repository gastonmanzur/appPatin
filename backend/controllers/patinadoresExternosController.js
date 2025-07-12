const PatinadorExterno = require('../models/PatinadorExterno');

exports.listar = async (req, res) => {
  try {
    const { numero, categoria } = req.query;
    const query = {};
    if (numero) {
      query.numeroCorredor = Number(numero);
    }
    if (categoria) {
      query.categoria = categoria;
    }
    const patinadores = await PatinadorExterno.find(query).sort({ numeroCorredor: 1 });
    res.json(patinadores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener patinadores externos' });
  }
};

exports.crear = async (req, res) => {
  try {
    const { numeroCorredor, nombre, club, categoria } = req.body;
    if (!numeroCorredor || !nombre) {
      return res.status(400).json({ msg: 'Número y nombre requeridos' });
    }
    await PatinadorExterno.findOneAndUpdate(
      { numeroCorredor, categoria },
      { numeroCorredor, nombre, club, categoria },
      { upsert: true, new: true }
    );
    res.json({ msg: 'Patinador externo guardado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al guardar patinador externo' });
  }
};
