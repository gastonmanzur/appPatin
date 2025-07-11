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
router.put('/:id', auth, checkRole(['Delegado']), competenciasController.editarCompetencia);
router.delete('/:id', auth, checkRole(['Delegado']), competenciasController.eliminarCompetencia);
router.post('/:id/confirmar', auth, competenciasController.confirmarParticipacion);
router.get('/:id/lista-buena-fe', auth, competenciasController.obtenerListaBuenaFe);
router.get('/:id/lista-buena-fe/excel', auth, competenciasController.exportarListaBuenaFeExcel);
router.post('/:id/lista-buena-fe/manual', auth, checkRole(['Delegado']), competenciasController.agregarPatinadorManual);
router.put('/:id/lista-buena-fe/manual/:patinadorId', auth, checkRole(['Delegado']), competenciasController.actualizarBajaPatinadorManual);


module.exports = router;
