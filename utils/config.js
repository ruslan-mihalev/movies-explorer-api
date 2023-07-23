const PROD_NODE_ENV = 'production';

const DEV_PORT = '3000';
const DEV_MONGO_DB = 'mongodb://localhost:27017/bitfilmsdb';
const DEV_JWT_SECRET = 'dev-secret';

const REQUESTS_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const REQUESTS_LIMIT = 100; // limit of requests

const JWT_COOKIE_NAME = 'jwt';
const JWT_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // one week
const JWT_COOKIE_HTTP_ONLY = true;

module.exports = {
  PROD_NODE_ENV,
  DEV_PORT,
  DEV_MONGO_DB,
  DEV_JWT_SECRET,
  REQUESTS_RATE_LIMIT_WINDOW,
  REQUESTS_LIMIT,
  JWT_COOKIE_NAME,
  JWT_COOKIE_MAX_AGE,
  JWT_COOKIE_HTTP_ONLY,
};
