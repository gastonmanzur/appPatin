const { body, validationResult } = require('express-validator');

exports.validarCrearPatinador = [
  body('primerNombre').isString().notEmpty(),
  body('apellido').isString().notEmpty(),
  body('dni').isInt({ min: 1 }),
  body('sexo').isIn(['M', 'F']),
  body('nivel').isIn(['Federado', 'Intermedia', 'Transicion', 'Escuela']),
  body('edad').isInt({ min: 0 }),
  body('fechaNacimiento').isISO8601(),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errors: errores.array() });
    }
    next();
  }
];
