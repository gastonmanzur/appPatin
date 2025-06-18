const express = require('express');
const router = express.Router();
const patinadoresController = require('../controllers/patinadoresController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Asociar patinador por DNI
router.post('/asociar', auth, patinadoresController.asociarPatinador);

// Obtener patinadores asociados al usuario
router.get('/mis-patinadores', auth, patinadoresController.getMisPatinadores);

module.exports = router;
