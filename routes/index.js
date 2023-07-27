const router = require('express').Router();
const { NotFoundError } = require('../middlewares/errors');

router.use('/movies', require('./movies'));
router.use('/users', require('./users'));

router.use((req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});

module.exports = router;
