const userRouter = require('express').Router();

const {
  getUser,
  updateInfo,
} = require('../controllers/users');

const { updateUserInfoValidation } = require('../middlewares/validation');

userRouter.get('/me', getUser);

userRouter.patch('/me', updateUserInfoValidation, updateInfo);

module.exports = userRouter;
