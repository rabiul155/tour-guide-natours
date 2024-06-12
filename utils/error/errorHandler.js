const AppError = require('./appError');

exports.castError = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(400, message);
};
exports.validationError = err => {
  const values = Object.values(err.errors).map(el => el.message);
  const message = `Validation error. ${values.join('. ')}`;
  return new AppError(400, message);
};

exports.duplicateFieldsError = err => {
  const message = `Duplicate field value, field name : "${
    Object.keys(err.keyPattern)[0]
  }" value : "${err.keyValue[Object.keys(err.keyPattern)[0]]}"`;
  return new AppError(400, message);
};
