const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReview = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.id) {
    filter.tour = req.params.id;
  }
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const tour = req.params.id;
  const user = req.user._id;

  const payload = {
    ...req.body,
    user,
    tour
  };

  const review = await Review.create(payload);
  res.status(201).json({
    status: 'success',
    message: 'Review created successfully',
    data: {
      review
    }
  });
});
