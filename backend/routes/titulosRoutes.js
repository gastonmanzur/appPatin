const express = require('express');
const router = express.Router();
const titulosController = require('../controllers/titulosController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// Rutas para títulos individuales
router.post('/individual', auth, checkRole(['Delegado']), upload.single('imagen'), titulosController.crearTituloIndividual);
router.get('/individual', auth, titulosController.listarTitulosIndividuales);
router.put('/individual/:id', auth, checkRole(['Delegado']), upload.single('imagen'), titulosController.editarTituloIndividual);
router.delete('/individual/:id', auth, checkRole(['Delegado']), titulosController.eliminarTituloIndividual);

// Rutas para títulos de club
router.post('/club', auth, checkRole(['Delegado']), upload.single('imagen'), titulosController.crearTituloClub);
router.get('/club', auth, titulosController.listarTitulosClub);
router.put('/club/:id', auth, checkRole(['Delegado']), upload.single('imagen'), titulosController.editarTituloClub);
router.delete('/club/:id', auth, checkRole(['Delegado']), titulosController.eliminarTituloClub);

module.exports = router;
