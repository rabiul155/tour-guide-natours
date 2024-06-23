const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const createToken = require('../utils/createToken');
const AppError = require('../utils/error/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = createToken(newUser._id);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    token,
    data: {
      newUser
    }
  });
});
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = createToken(newUser._id);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    token,
    data: {
      newUser
    }
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    throw new AppError(400, 'Invalid email or password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError(401, 'Incorrect email or password'));
  }

  const token = createToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Sign in successfully',
    token,
    data: {
      user
    }
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(401, 'You are not logged in! Please log in to get access.')
    );
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
