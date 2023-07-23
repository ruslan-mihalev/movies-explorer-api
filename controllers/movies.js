const { DocumentNotFoundError, ValidationError } = require('mongoose').Error;
const Movie = require('../models/movie');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../middlewares/errors');
const { HTTP_CODE_CREATED } = require('../utils/httpCodes');
const { ATTEMPT_TO_DELETE_MOVIE_FOR_ANOTHER_USER } = require('../utils/errorMessages');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then(async (movie) => movie.populate('owner'))
    .then((movie) => {
      res.status(HTTP_CODE_CREATED).send(movie);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id: userId } = req.user;
  const { _id: movieId } = req.params;

  Movie.findById(movieId)
    .populate('owner')
    .orFail()
    .then((movie) => {
      const { owner: { _id: ownerId } } = movie;
      if (ownerId.equals(userId)) {
        return movie.deleteOne();
      }
      return Promise.reject(new ForbiddenError(ATTEMPT_TO_DELETE_MOVIE_FOR_ANOTHER_USER));
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError());
      } else {
        next(err);
      }
    });
};
