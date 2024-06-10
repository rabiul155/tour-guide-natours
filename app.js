const express = require('express');
const path = require('path');
// const morgan = require('morgan');

const AppError = require('./utils/error/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorhandler = require('./utils/error/globalErrorHandler');

const app = express();

// 1) MIDDLEWARES
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

//Root route
app.get('/', (req, res) => {
  res.send('Hello from the server');
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      404,
      `Cannot find this route ${req.originalUrl} on this server`
    )
  );
});

app.use(globalErrorhandler);

module.exports = app;
