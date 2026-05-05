const express = require('express');
const router = express.Router();
const { getAllGames, getGameBySlug, createGame, updateGame, deleteGame } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllGames);
router.get('/:slug', getGameBySlug);
router.post('/', protect, upload.single('thumbnail'), createGame);
router.put('/:id', protect, upload.single('thumbnail'), updateGame);
router.delete('/:id', protect, deleteGame);

module.exports = router;
