const globalErrorhandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Internal server error';

  res.status(err.statusCode).json({
    success: err.status,
    message: err.message,
    error: err
  });
};

module.exports = globalErrorhandler;
