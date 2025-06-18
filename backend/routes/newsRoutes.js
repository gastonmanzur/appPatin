const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// rutas
router.post('/', auth, checkRole(['Tecnico', 'Delegado']), upload.single('imagen'), newsController.createNews);
router.get('/', auth, newsController.getNews);

module.exports = router;
