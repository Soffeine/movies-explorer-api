require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
// добавить переменные окружения и не забыть пофиксить все в других файлах

const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const cors = require('cors');

const options = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    // плюс еще будет фронт-домен
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const { signUpValidation, signInValidation } = require('./middlewares/validation');
const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/not-found-error');

mongoose.connect('mongodb://localhost:27017/beatfilmsdb', {
  useNewUrlParser: true,
});

app.use('*', cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

app.use(cookieParser());

app.post('/signup', signUpValidation, createUser);
app.post('/signin', signInValidation, login);
app.post('/signout', (req, res) => {
  res
    .clearCookie('jwt')
    .redirect('/signin')
    .end();
});

app.use(auth);

app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use((req, res, next) => {
  next(new NotFoundError('Такого запроса не существует'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log('its alive!!!');
});
