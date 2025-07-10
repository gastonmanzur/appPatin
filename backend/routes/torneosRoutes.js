const express = require('express');
const router = express.Router();
const torneoController = require('../controllers/torneosController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post('/', auth, checkRole(['Delegado']), torneoController.crearTorneo);
router.get('/', auth, torneoController.listarTorneos);
router.get('/:id/ranking', auth, torneoController.getRankingTorneo);
router.get('/:id/ranking-categorias', auth, torneoController.getRankingCategoriasTorneo);
router.post('/:id/confirmar', auth, torneoController.confirmarParticipacion);

module.exports = router;
