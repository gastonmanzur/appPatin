const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, notificationsController.obtenerNotificaciones);
router.put('/:id/leida', auth, notificationsController.marcarLeida);

module.exports = router;
