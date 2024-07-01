const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.authenticate, reviewController.getAllReview)
  .post(
    authController.authenticate,
    authController.authorization('user'),
    reviewController.createReview
  );

module.exports = router;
