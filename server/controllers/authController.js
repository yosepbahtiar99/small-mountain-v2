const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // In a single-admin system, we could also just check env vars, 
    // but using DB is more scalable as per blueprint.
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 'Invalid username or password', 401);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set Refresh Token in HttpOnly Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return successResponse(res, 'Login successful', {
      user: { id: user.id, username: user.username },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token missing', 401);
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return errorResponse(res, 'Invalid refresh token', 403);

      const user = await User.findByPk(decoded.id);
      if (!user) return errorResponse(res, 'User not found', 404);

      const accessToken = generateAccessToken(user);
      return successResponse(res, 'Token refreshed', { accessToken });
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie('refreshToken');
  return successResponse(res, 'Logged out successfully');
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    return successResponse(res, 'User profile fetched', user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  refresh,
  logout,
  getMe
};
