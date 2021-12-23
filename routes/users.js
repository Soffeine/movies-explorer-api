const userRouter = require('express').Router();

const {
  getUsers,
  getUser,
  updateInfo,
} = require('../controllers/users');

const { updateUserInfoValidation } = require('../middlewares/validation');

userRouter.get('/users', getUsers);

userRouter.get('users/me', getUser);

userRouter.patch('users/me', updateUserInfoValidation, updateInfo);

module.exports = userRouter;
