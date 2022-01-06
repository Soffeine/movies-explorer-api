const User = require('../models/user');

const ValidationError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

// получение массива всех пользователей
const getUsers = (req, res, next) => {
  User.find({ })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// получение данных о пользователе
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

// редактирование информации в профиле
const updateInfo = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('кажется, такого пользователя не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.statusCode(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('переданы некорректные данные при создании пользователя'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('Такого пользователя не существует'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  updateInfo,
};
