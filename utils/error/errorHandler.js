const AppError = require('./appError');

exports.castError = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(400, message);
};
