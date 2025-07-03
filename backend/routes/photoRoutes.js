const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photosController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

router.post('/', auth, checkRole(['Tecnico', 'Delegado']), upload.single('imagen'), photoController.createPhoto);
router.get('/', auth, photoController.getPhotos);

module.exports = router;
