const movieRouter = require('express').Router();

const {
  getMovies,
  addMovieToFavourites,
  deleteMovieFromFavourites,
} = require('../controllers/movies');

const {
  addToFavouritesValidation,
  deleteMovieValidation,
} = require('../middlewares/validation');

movieRouter.get('/', getMovies);

movieRouter.post('/', addToFavouritesValidation, addMovieToFavourites);

movieRouter.delete('/:movieId', deleteMovieValidation, deleteMovieFromFavourites);

module.exports = movieRouter;
