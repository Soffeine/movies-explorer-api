const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');

// заргузка сохраненных фильмов
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch((err) => {
      next(err);
    })
    .catch(next);
};

// добавление фильма в сохраненное
const addMovieToFavourites = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch(next);
};

// удаление фильма их сохраненных
const deleteMovieFromFavourites = (req, res, next) => {
  const { movieId } = req.params;
  return Movie.findByIdAndDelete(movieId)
    .orFail(() => new NotFoundError('такого фильма нет в вашем избранном'))
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  addMovieToFavourites,
  deleteMovieFromFavourites,
};
