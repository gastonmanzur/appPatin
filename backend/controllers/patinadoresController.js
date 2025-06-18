const User = require('../models/User');
const Patinador = require('../models/Patinador');

// Asociar patinador por DNI
exports.asociarPatinador = async (req, res) => {
  try {
    const { dniBuscado } = req.body;

    const patinadores = await Patinador.find({
      $or: [
        { dniPadre: dniBuscado },
        { dniMadre: dniBuscado }
      ]
    });

    if (patinadores.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron patinadores con ese DNI' });
    }

    const user = await User.findById(req.user.id);

    patinadores.forEach(patinador => {
      if (!user.patinadoresAsociados.includes(patinador._id)) {
        user.patinadoresAsociados.push(patinador._id);
      }
    });

    await user.save();
    res.json({ msg: 'Patinadores asociados correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al asociar patinadores' });
  }
};

// Obtener patinadores asociados
exports.getMisPatinadores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('patinadoresAsociados');
    res.json(user.patinadoresAsociados);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener tus patinadores' });
  }
};
