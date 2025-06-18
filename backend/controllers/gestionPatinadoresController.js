const Patinador = require('../models/Patinador');
const calcularCategoria = require('../utils/calcularCategoria');

// Crear patinador
exports.crearPatinador = async (req, res) => {
  try {
    const { 
      primerNombre, segundoNombre, apellido, edad, fechaNacimiento, dni, cuil, direccion, 
      dniMadre, dniPadre, telefono, sexo, nivel, numeroCorredor 
    } = req.body;

    const categoria = calcularCategoria(fechaNacimiento, sexo, nivel);
    
    const patinador = new Patinador({
      primerNombre, segundoNombre, apellido, edad, fechaNacimiento, dni, cuil, direccion, 
      dniMadre, dniPadre, telefono, sexo, nivel, numeroCorredor,
      categoria,
      foto: req.files?.foto?.[0]?.filename || null,
      fotoRostro: req.files?.fotoRostro?.[0]?.filename || null
    });

    await patinador.save();
    res.json({ msg: 'Patinador creado correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear patinador' });
  }
};

exports.getTodosLosPatinadores = async (req, res) => {
  try {
    const patinadores = await Patinador.find();
    res.json(patinadores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener patinadores' });
  }
};

exports.eliminarPatinador = async (req, res) => {
  try {
    const { id } = req.params;
    await Patinador.findByIdAndDelete(id);
    res.json({ msg: 'Patinador eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar patinador' });
  }
};

exports.editarPatinador = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      primerNombre, segundoNombre, apellido, edad, fechaNacimiento, dni, cuil, direccion, 
      dniMadre, dniPadre, telefono, sexo, nivel, numeroCorredor 
    } = req.body;

    const categoria = calcularCategoria(fechaNacimiento, sexo, nivel);

    const updateData = {
      primerNombre, segundoNombre, apellido, edad, fechaNacimiento, dni, cuil, direccion, 
      dniMadre, dniPadre, telefono, sexo, nivel, numeroCorredor, categoria
    };

    if (req.files?.foto?.[0]?.filename) {
      updateData.foto = req.files.foto[0].filename;
    }
    if (req.files?.fotoRostro?.[0]?.filename) {
      updateData.fotoRostro = req.files.fotoRostro[0].filename;
    }

    await Patinador.findByIdAndUpdate(id, updateData);
    res.json({ msg: 'Patinador actualizado correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar patinador' });
  }
};
