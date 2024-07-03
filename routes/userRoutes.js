const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const upload = multer({
  dest: 'public/image/users'
});
const router = express.Router();

router.post('/singup', authController.signup);
router.post('/singin', authController.signin);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

router.use(authController.authenticate);

router.get('/getMe', userController.getMe);
router.patch('/updateMe', upload.single('photo'), userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.post('/updatePassword', authController.updatePassword);

router
  .route('/')
  .get(authController.authorization('admin'), userController.getAllUsers)
  .post(authController.authorization('admin'), userController.createUser);

router
  .route('/:id')
  .get(authController.authorization('admin'), userController.getUser)
  .patch(authController.authorization('admin'), userController.updateUser)
  .delete(authController.authorization('admin'), userController.deleteUser);

module.exports = router;
