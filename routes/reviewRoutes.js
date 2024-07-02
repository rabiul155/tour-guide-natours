const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.authenticate);

router
  .route('/')
  .get(reviewController.getAllReview)
  .post(authController.authorization('user'), reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.authorization('admin', 'user'),
    reviewController.updateReview
  )
  .delete(
    authController.authorization('admin', 'user'),
    reviewController.deleteReview
  );

module.exports = router;
