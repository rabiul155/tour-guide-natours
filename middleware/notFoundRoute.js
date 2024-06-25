const AppError = require('../utils/error/appError');

const notFoundRoute = (req, res, next) => {
  next(
    new AppError(
      404,
      `Cannot find this route ${req.originalUrl} on this server`
    )
  );
};

module.exports = notFoundRoute;
