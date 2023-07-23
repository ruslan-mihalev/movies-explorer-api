const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { DocumentNotFoundError, ValidationError } = require('mongoose').Error;
const User = require('../models/user');
const {
  HttpError, NotFoundError, BadRequestError, UnauthorizedError, ConflictError,
} = require('../middlewares/errors');
const { HTTP_CODE_CREATED } = require('../utils/httpCodes');

const { WRONG_EMAIL_OR_PASSWORD, USER_WITH_EMAIL_ALREADY_EXISTS } = require('../utils/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;
const MILLISECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const secret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: MILLISECONDS_IN_WEEK, httpOnly: true })
        .send({ email })
        .end();
    })
    .catch((err) => {
      if (err instanceof HttpError) {
        next(err);
      } else {
        next(new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD));
      }
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt')
    .send({})
    .end();
};

module.exports.register = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.status(HTTP_CODE_CREATED)
        .send({ data: user.copyWithoutPassword() });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(USER_WITH_EMAIL_ALREADY_EXISTS));
      } else if (err instanceof ValidationError) {
        next(new BadRequestError(WRONG_EMAIL_OR_PASSWORD));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь по указанному ${userId} не найден.`));
      } else {
        next(err);
      }
    });
};

module.exports.updateCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;
  const { email, name } = req.body;

  User.findByIdAndUpdate(userId, { email, name }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError());
      } else if (err instanceof ValidationError) {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};
