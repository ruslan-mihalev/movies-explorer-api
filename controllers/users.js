const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { DocumentNotFoundError, ValidationError } = require('mongoose').Error;
const User = require('../models/user');
const {
  HttpError, NotFoundError, BadRequestError, UnauthorizedError, ConflictError,
} = require('../middlewares/errors');
const { HTTP_CODE_CREATED } = require('../utils/httpCodes');

const { WRONG_EMAIL_OR_PASSWORD, USER_WITH_EMAIL_ALREADY_EXISTS } = require('../utils/errorMessages');

const {
  DEV_JWT_SECRET,
  JWT_COOKIE_MAX_AGE,
  JWT_COOKIE_NAME,
  JWT_COOKIE_HTTP_ONLY,
  PROD_NODE_ENV,
} = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const secret = NODE_ENV === PROD_NODE_ENV ? JWT_SECRET : DEV_JWT_SECRET;
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '7d' });
      const cookieOptions = { maxAge: JWT_COOKIE_MAX_AGE, httpOnly: JWT_COOKIE_HTTP_ONLY };
      res.cookie(JWT_COOKIE_NAME, token, cookieOptions)
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
  res.clearCookie(JWT_COOKIE_NAME)
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
