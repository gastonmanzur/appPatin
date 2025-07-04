const express = require('express');
const router = express.Router();
const asistenciasController = require('../controllers/asistenciasController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post('/', auth, checkRole(['Tecnico']), asistenciasController.crearAsistencia);
router.get('/', auth, checkRole(['Tecnico']), asistenciasController.obtenerAsistencias);
router.get('/:id', auth, checkRole(['Tecnico']), asistenciasController.obtenerAsistencia);
router.put('/:id', auth, checkRole(['Tecnico']), asistenciasController.actualizarAsistencia);
router.delete('/:id', auth, checkRole(['Tecnico']), asistenciasController.eliminarAsistencia);

module.exports = router;
