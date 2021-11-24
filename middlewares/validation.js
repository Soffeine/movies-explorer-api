const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const addToFavouritesValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((url) => {
      if (!validator.isURL(url, { require_protocol: true })) {
        throw new Error('С ссылкой что-то не так!');
      }
      return url;
    }),
    trailer: Joi.string().required().custom((url) => {
      if (!validator.isURL(url, { require_protocol: true })) {
        throw new Error('С ссылкой что-то не так!');
      }
      return url;
    }),

    thumbnail: Joi.string().required().custom((url) => {
      if (!validator.isURL(url, { require_protocol: true })) {
        throw new Error('С ссылкой что-то не так!');
      }
      return url;
    }),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
  updateUserInfoValidation,
  addToFavouritesValidation,
  deleteMovieValidation,
};
