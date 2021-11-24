const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const ValidationError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const AuthError = require('../errors/auth-error');

// регистрация пользователя
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже существует');
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации: данные некорректо заполнены'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }).send(200);
    })
    .catch((err) => {
      next(new AuthError(err.message));
    })
    .catch(next);
};
// получение данных о пользователе
const getUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ name, email })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

// редактирование информации в профиле
const updateInfo = (req, res, next) => {
  const { name, email } = req.body;
  return User.findOneAndUpdate({ email, name }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('кажется, такого пользователя не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
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
  getUser,
  updateInfo,
  createUser,
  login,
};
