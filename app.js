const express = require('express');
const path = require('path');
const helmet = require('helmet');
// const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorhandler = require('./middleware/globalErrorHandler');
const notFoundRoute = require('./middleware/notFoundRoute');
const limitRequest = require('./middleware/limitRequest');

const app = express();

// 1) MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
// Parse json data
app.use(express.json({ limit: '10kb' }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Limit requests from same API
app.use('/', limitRequest);
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

//Root route
app.get('/', (req, res) => {
  res.send('Hello from the server');
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//  Handle not found route
app.all('*', notFoundRoute);

// Global error handler
app.use(globalErrorhandler);

module.exports = app;
