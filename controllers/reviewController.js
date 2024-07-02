const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

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

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Review find successfully',
    data: {
      review
    }
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Review updated successfully',
    data: {
      review
    }
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Review deleted successfully',
    data: null
  });
});
