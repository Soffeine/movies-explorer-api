require('dotenv').config();

const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { PORT = 3000, NODE_ENV, DB_CONNECT } = process.env;
const cors = require('cors');

const options = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://beatfilm.sof.nomoredomains.work',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const signupRoute = require('./routes/signup');
const signinRoute = require('./routes/signin');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/not-found-error');

mongoose.connect(NODE_ENV === 'production' ? DB_CONNECT : 'mongodb://localhost:27017/beatfilmsdb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.use(limiter);

app.use('*', cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(cookieParser());

app.use(signupRoute);
app.use(signinRoute);

app.use(auth);

app.use(userRoutes);
app.use(movieRoutes);
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

app.listen(PORT, () => {
  console.log('its alive!!!');
});
