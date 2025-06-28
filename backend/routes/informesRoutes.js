const express = require('express');
const router = express.Router();
const controller = require('../controllers/informesController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post('/', auth, checkRole(['Tecnico']), controller.crearInforme);
router.get('/patinador/:id', auth, controller.obtenerInformesPorPatinador);
router.put('/:id', auth, checkRole(['Tecnico']), controller.editarInforme);
router.delete('/:id', auth, checkRole(['Tecnico']), controller.eliminarInforme);

module.exports = router;
