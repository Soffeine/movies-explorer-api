const signupRoute = require('express').Router();

const { signUpValidation } = require('../middlewares/validation');

const { createUser } = require('../controllers/signup');

signupRoute.post('/signup', signUpValidation, createUser);

module.exports = signupRoute;
