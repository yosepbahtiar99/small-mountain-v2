const Blog = require('../models/Blog');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { slugify } = require('../utils/slugify');

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({ order: [['createdAt', 'DESC']] });
    return successResponse(res, 'Blogs fetched', blogs);
  } catch (error) {
    next(error);
  }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ where: { slug: req.params.slug } });
    if (!blog) return errorResponse(res, 'Blog not found', 404);
    return successResponse(res, 'Blog fetched', blog);
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    
    if (!title || !content) {
      return errorResponse(res, 'Title and content are required', 400);
    }

    let slug = slugify(title);
    const existingSlug = await Blog.findOne({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const thumbnail = req.file ? req.file.path : null;

    const blog = await Blog.create({
      title,
      slug,
      content,
      category,
      thumbnail
    });

    return successResponse(res, 'Blog created', blog, 201);
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return errorResponse(res, 'Blog not found', 404);

    const updateData = { title, content, category };
    
    if (title && title !== blog.title) {
      let slug = slugify(title);
      const existingSlug = await Blog.findOne({ where: { slug } });
      if (existingSlug && existingSlug.id !== blog.id) {
        slug = `${slug}-${Date.now()}`;
      }
      updateData.slug = slug;
    }

    if (req.file) updateData.thumbnail = req.file.path;

    await blog.update(updateData);
    return successResponse(res, 'Blog updated', blog);
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return errorResponse(res, 'Blog not found', 404);
    await blog.destroy();
    return successResponse(res, 'Blog deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
};
