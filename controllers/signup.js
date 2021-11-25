const bcrypt = require('bcryptjs');
const User = require('../models/user');

const ConflictError = require('../errors/conflict-error');
const ValidationError = require('../errors/bad-request-error');

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

module.exports = { createUser };
