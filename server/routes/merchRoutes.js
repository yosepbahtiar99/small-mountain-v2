const express = require('express');
const router = express.Router();
const { getAllMerch, createMerch, updateMerch, deleteMerch } = require('../controllers/merchController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllMerch);
router.post('/', protect, upload.single('thumbnail'), createMerch);
router.put('/:id', protect, upload.single('thumbnail'), updateMerch);
router.delete('/:id', protect, deleteMerch);

module.exports = router;
