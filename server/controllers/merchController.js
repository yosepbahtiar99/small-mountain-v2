const Merch = require('../models/Merch');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAllMerch = async (req, res, next) => {
  try {
    const merch = await Merch.findAll({ order: [['createdAt', 'DESC']] });
    return successResponse(res, 'Merch fetched', merch);
  } catch (error) {
    next(error);
  }
};

const createMerch = async (req, res, next) => {
  try {
    const { name, price, shopeeLink } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    const merch = await Merch.create({
      name,
      price,
      shopeeLink,
      thumbnail
    });

    return successResponse(res, 'Merch created', merch, 201);
  } catch (error) {
    next(error);
  }
};

const updateMerch = async (req, res, next) => {
  try {
    const { name, price, shopeeLink } = req.body;
    const merch = await Merch.findByPk(req.params.id);
    if (!merch) return errorResponse(res, 'Merch not found', 404);

    const updateData = { name, price, shopeeLink };
    if (req.file) updateData.thumbnail = req.file.path;

    await merch.update(updateData);
    return successResponse(res, 'Merch updated', merch);
  } catch (error) {
    next(error);
  }
};

const deleteMerch = async (req, res, next) => {
  try {
    const merch = await Merch.findByPk(req.params.id);
    if (!merch) return errorResponse(res, 'Merch not found', 404);
    await merch.destroy();
    return successResponse(res, 'Merch deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMerch,
  createMerch,
  updateMerch,
  deleteMerch
};
