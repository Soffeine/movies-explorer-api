const signinRoute = require('express').Router();

const { signInValidation } = require('../middlewares/validation');

const { login } = require('../controllers/signin');

signinRoute.post('/signin', signInValidation, login);

module.exports = signinRoute;
