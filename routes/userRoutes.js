const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/singup', authController.signup);
router.post('/singin', authController.signin);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

router.post(
  '/updatePassword',
  authController.authenticate,
  authController.updatePassword
);

router.patch('/updateMe', authController.authenticate, userController.updateMe);
router.delete(
  '/deleteMe',
  authController.authenticate,
  userController.deleteMe
);

router
  .route('/')
  .get(
    authController.authenticate,
    authController.authorization('admin'),
    userController.getAllUsers
  )
  .post(
    authController.authenticate,
    authController.authorization('admin'),
    userController.createUser
  );

router
  .route('/:id')
  .get(
    authController.authenticate,
    authController.authorization('admin'),
    userController.getUser
  )
  .patch(
    authController.authenticate,
    authController.authorization('admin'),
    userController.updateUser
  )
  .delete(
    authController.authenticate,
    authController.authorization('admin'),
    userController.deleteUser
  );

module.exports = router;
