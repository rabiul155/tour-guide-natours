const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewsController = require('./../controllers/reviewController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.authenticate, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.authenticate,
    authController.authorization('admin'),
    tourController.updateTour
  )
  .delete(
    authController.authenticate,
    authController.authorization('admin'),
    tourController.deleteTour
  );

router.post(
  '/:id/reviews',
  authController.authenticate,
  authController.authorization('user'),
  reviewsController.createReview
);

module.exports = router;
