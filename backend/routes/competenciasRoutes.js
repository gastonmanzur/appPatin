const express = require('express');
const router = express.Router();
const competenciasController = require('../controllers/competenciasController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Solo Delegado gestiona competencias
router.post('/', auth, checkRole(['Delegado']), competenciasController.crearCompetencia);
router.put('/resultados', auth, checkRole(['Delegado']), competenciasController.agregarResultados);
router.get('/', auth, competenciasController.listarCompetencias);
router.put('/resultados-club', auth, checkRole(['Delegado']), competenciasController.agregarResultadosClub);


module.exports = router;
