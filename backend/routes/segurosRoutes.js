const express = require('express');
const router = express.Router();
const controller = require('../controllers/segurosController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, controller.crearSolicitud);

module.exports = router;
