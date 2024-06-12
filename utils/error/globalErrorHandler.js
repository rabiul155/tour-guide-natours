const errorHandler = require('./errorHandler');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};

const globalErrorhandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Internal server error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode;
    if (err.name === 'CastError') {
      error = errorHandler.castError(err);
    }
    if (err.name === 'ValidationError') {
      error = errorHandler.validationError(err);
    }
    if (err.code === 11000) {
      error = errorHandler.duplicateFieldsError(err);
    }
    sendErrorProd(error, res);
  }
};

module.exports = globalErrorhandler;
