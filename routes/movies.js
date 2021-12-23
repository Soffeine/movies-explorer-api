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

movieRouter.get('/movies', getMovies);

movieRouter.post('/movies', addToFavouritesValidation, addMovieToFavourites);

movieRouter.delete('movies/:movieId', deleteMovieValidation, deleteMovieFromFavourites);

module.exports = movieRouter;
