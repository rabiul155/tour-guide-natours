const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const createToken = require('../utils/createToken');
const AppError = require('../utils/error/appError');
const sendEmail = require('../utils/email');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
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

exports.authenticate = catchAsync(async (req, res, next) => {
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
        401,
        'The user belonging to this token does no longer exist.'
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(401, 'User recently changed password! Please log in again.')
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "You don't have this permission"));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(403, 'User not found with this email'));
  }

  const resetToken = await jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '10m'
    }
  );

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword?email=${user.email}&token=${resetToken}`;

  try {
    await sendEmail(
      'rabiul.islam4715@gmail.com',
      'Password Reset Link',
      resetURL
    );
  } catch (err) {
    throw new AppError(400, 'Error sending email');
  }

  res.status(200).json({
    success: true,
    message: 'Reset password link send to your email'
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  // 3) update user password
  const user = await User.findOne({ email: decoded.email });
  user.password = req.body.newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: 'Password updated successfully'
  });
});
