const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./errors');
const { DEV_JWT_SECRET, JWT_COOKIE_NAME, PROD_NODE_ENV } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies[JWT_COOKIE_NAME];
  const secret = NODE_ENV === PROD_NODE_ENV ? JWT_SECRET : DEV_JWT_SECRET;
  if (token) {
    try {
      req.user = jwt.verify(token, secret);
      next();
    } catch (err) {
      next(new UnauthorizedError());
    }
  } else {
    next(new UnauthorizedError());
  }
};
