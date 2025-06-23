const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');
const auth = require('../middleware/authMiddleware');

router.get('/general', auth, rankingController.getRankingGeneral);
router.get('/categorias', auth, rankingController.getRankingPorCategorias);
router.get('/clubes', auth, rankingController.getRankingClubes);
router.get('/categorias/:id', auth, rankingController.getRankingCategoriasCompetencia);



module.exports = router;
