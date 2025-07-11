const PatinadorExterno = require('../models/PatinadorExterno');

exports.listar = async (req, res) => {
  try {
    const { numero } = req.query;
    const query = {};
    if (numero) {
      query.numeroCorredor = Number(numero);
    }
    const patinadores = await PatinadorExterno.find(query).sort({ numeroCorredor: 1 });
    res.json(patinadores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener patinadores externos' });
  }
};
