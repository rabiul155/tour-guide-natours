const express = require('express');
const reviewRoute = require('./reviewRoutes');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use('/:id/reviews', reviewRoute);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.authenticate,
    authController.authorization('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.authenticate,
    authController.authorization('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.authenticate,
    authController.authorization('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.authenticate,
    authController.authorization('admin', 'lead-guide'),
    tourController.deleteTour
  );

router.post('/:id/reviews');

module.exports = router;
