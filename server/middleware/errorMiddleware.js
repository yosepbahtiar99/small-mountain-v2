const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Multer File Size Limit Error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File is too large! Maximum allowed size is 5MB.';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
  }

  return errorResponse(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};

module.exports = errorHandler;
