const rateLimit = require('express-rate-limit');

const { REQUESTS_RATE_LIMIT_WINDOW, REQUESTS_LIMIT } = require('./config');

const limiter = rateLimit({
  windowMs: REQUESTS_RATE_LIMIT_WINDOW,
  max: REQUESTS_LIMIT,
});

module.exports = limiter;
