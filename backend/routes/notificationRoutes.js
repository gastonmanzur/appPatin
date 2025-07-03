const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.get('/', auth, notificationsController.obtenerNotificaciones);
router.put('/:id/leida', auth, notificationsController.marcarLeida);
router.post('/', auth, checkRole(['Tecnico', 'Delegado']), notificationsController.crearNotificacion);

module.exports = router;
