const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/error/appError');
const { filterObj } = require('../utils/helpers');

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'User is created successfully!',
    data: {
      user
    }
  });
};
exports.updateUser = async (req, res) => {
  const payload = {};
  if (req.body.role) payload.role = req.body.role;
  if (req.body.name) payload.name = req.body.name;
  if (Object.keys(payload).length === 0) {
    throw new AppError(401, 'Only name and role can be updated');
  }
  const user = await User.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    message: 'User is updated successfully!',
    data: {
      user
    }
  });
};
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(500).json({
    status: 'success',
    message: 'User is deleted!',
    data: null
  });
};
