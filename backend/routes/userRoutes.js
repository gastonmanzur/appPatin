const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/me', auth, userController.getCurrentUser);
router.put('/picture', auth, upload.single('picture'), userController.updateProfilePicture);

module.exports = router;
