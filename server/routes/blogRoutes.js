const express = require('express');
const router = express.Router();
const { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, upload.single('thumbnail'), createBlog);
router.put('/:id', protect, upload.single('thumbnail'), updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
