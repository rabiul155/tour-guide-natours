const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('../utils/error/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  // EXECUTE QUERY
  const features = new APIFeatures(
    Tour.find().populate({
      path: 'guide',
      select: '-__v, -passwordChangedAt'
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'guide',
    select: '-__v, -passwordChangedAt'
  });
  if (!tour) {
    throw new AppError(404, 'No tour found with this id');
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tour) {
    throw new AppError(404, 'No tour found with this id');
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    throw new AppError(404, 'No tour found with this id');
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        tour: { $push: '$$ROOT' }
      }
    }
  ]).sort('avgPrice');

  res.status(200).json({
    status: 'success',
    count: stats.length,
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        },
        difficulty: 'easy'
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTour: { $sum: 1 },
        name: { $push: '$name' },
        tour: { $push: '$$ROOT' }
      }
    },
    {
      $addFields: { year: year }
    }
  ])
    .sort({ numOfTour: -1 })
    .limit(12)
    .project('-tour.__v');

  res.status(200).json({
    status: 'success',
    count: plan.length,
    data: {
      plan
    }
  });
});
