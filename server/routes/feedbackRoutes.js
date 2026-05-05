const express = require('express');
const router = express.Router();
const { getAllFeedback, createFeedback, markAsRead, deleteFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllFeedback);
router.post('/', createFeedback);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
