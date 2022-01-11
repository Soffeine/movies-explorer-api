const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

// заргузка сохраненных фильмов
const getMovies = (req, res, next) => {
  const current = req.user._id;
  Movie.find({ owner: current })
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
  return Movie.create({
    ...req.body,
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
  return Movie.findById(movieId)
    .orFail(() => new NotFoundError('Такого фильма нет в вашем избранном'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError('У вас нет прав удалять этот фильм из коллекции'));
      } else {
        Movie.deleteOne(movie)
          .then(() => {
            res.send({ data: movie });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  addMovieToFavourites,
  deleteMovieFromFavourites,
};
