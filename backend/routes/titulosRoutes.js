const express = require('express');
const router = express.Router();
const titulosController = require('../controllers/titulosController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Rutas para títulos individuales
router.post('/individual', auth, checkRole(['Delegado']), titulosController.crearTituloIndividual);
router.get('/individual', auth, titulosController.listarTitulosIndividuales);

// Rutas para títulos de club
router.post('/club', auth, checkRole(['Delegado']), titulosController.crearTituloClub);
router.get('/club', auth, titulosController.listarTitulosClub);

module.exports = router;
