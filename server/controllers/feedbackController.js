const Feedback = require('../models/Feedback');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    return successResponse(res, 'Feedback fetched', feedback);
  } catch (error) {
    next(error);
  }
};

const createFeedback = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const feedback = await Feedback.create({ name, email, message });
    return successResponse(res, 'Feedback sent successfully', feedback, 21);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) return errorResponse(res, 'Feedback not found', 404);
    await feedback.update({ isRead: true });
    return successResponse(res, 'Feedback marked as read', feedback);
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) return errorResponse(res, 'Feedback not found', 404);
    await feedback.destroy();
    return successResponse(res, 'Feedback deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFeedback,
  createFeedback,
  markAsRead,
  deleteFeedback
};
