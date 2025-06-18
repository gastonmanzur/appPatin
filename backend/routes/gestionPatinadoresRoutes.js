const express = require('express');
const router = express.Router();
const controller = require('../controllers/gestionPatinadoresController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const uploadMultiple = require('../middleware/uploadMultiple');
const validator = require('../middleware/validaeDatosMiddleware')

// Solo Delegados pueden crear patinadores
router.post('/', auth, checkRole(['Delegado']), uploadMultiple, controller.crearPatinador);
router.get('/', auth, checkRole(['Delegado']), controller.getTodosLosPatinadores);
router.delete('/:id', auth, checkRole(['Delegado']), controller.eliminarPatinador);
router.put('/:id', auth, checkRole(['Delegado']), uploadMultiple, controller.editarPatinador);



module.exports = router;
