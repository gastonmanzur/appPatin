const express = require('express');
const router = express.Router();
const controller = require('../controllers/patinadoresExternosController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, controller.listar);

module.exports = router;
