const Game = require('../models/Game');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { slugify } = require('../utils/slugify');

const getAllGames = async (req, res, next) => {
  try {
    const games = await Game.findAll({ order: [['createdAt', 'DESC']] });
    return successResponse(res, 'Games fetched', games);
  } catch (error) {
    next(error);
  }
};

const getGameBySlug = async (req, res, next) => {
  try {
    const game = await Game.findOne({ where: { slug: req.params.slug } });
    if (!game) return errorResponse(res, 'Game not found', 404);
    return successResponse(res, 'Game fetched', game);
  } catch (error) {
    next(error);
  }
};

const createGame = async (req, res, next) => {
  try {
    const { title, description, status, progress, playLink } = req.body;
    const slug = slugify(title);
    const thumbnail = req.file ? req.file.path : null;

    const game = await Game.create({
      title,
      slug,
      description,
      status,
      progress: JSON.parse(progress || '{}'),
      thumbnail,
      playLink
    });

    return successResponse(res, 'Game created', game, 21);
  } catch (error) {
    next(error);
  }
};

const updateGame = async (req, res, next) => {
  try {
    const { title, description, status, progress, playLink } = req.body;
    const game = await Game.findByPk(req.params.id);
    if (!game) return errorResponse(res, 'Game not found', 404);

    const updateData = {
      title,
      description,
      status,
      progress: JSON.parse(progress || '{}'),
      playLink
    };

    if (title) updateData.slug = slugify(title);
    if (req.file) updateData.thumbnail = req.file.path;

    await game.update(updateData);
    return successResponse(res, 'Game updated', game);
  } catch (error) {
    next(error);
  }
};

const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return errorResponse(res, 'Game not found', 404);
    await game.destroy();
    return successResponse(res, 'Game deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGames,
  getGameBySlug,
  createGame,
  updateGame,
  deleteGame
};
