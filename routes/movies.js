const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { DELETE_MOVIE, POST_MOVIE } = require('../utils/validators');

router.get('/', getMovies);
router.post('/', POST_MOVIE, createMovie);
router.delete('/:_id', DELETE_MOVIE, deleteMovie);

module.exports = router;
