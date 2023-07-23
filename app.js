require('dotenv').config();
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const { errorsHandler } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { POST_SIGNUP, POST_SIGNIN } = require('./utils/validators');
const { register, login, logout } = require('./controllers/users');
const router = require('./routes');

const {
  DEV_PORT,
  DEV_MONGO_DB,
  REQUESTS_RATE_LIMIT_WINDOW,
  REQUESTS_LIMIT,
} = require('./utils/config');

const { PORT = DEV_PORT, MONGO_DB = DEV_MONGO_DB } = process.env;
mongoose.connect(MONGO_DB);

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: REQUESTS_RATE_LIMIT_WINDOW,
  max: REQUESTS_LIMIT,
});

app.use(limiter);

const corsOptions = {
  origin: [
    /^https?:\/\/localhost:\d{4}$/,
    /^https?:\/\/127\.0\.0\.1:\d{4}$/,
    /^https?:\/\/api\.kinopoisk\.nomoredomains\.xyz$/,
  ],
  credentials: true,
};
// for simple cors requests
app.use(cors(corsOptions));

app.use(express.json());

app.use(requestLogger);

// For pre-flight requests
app.options('*', cors());

app.post('/signup', POST_SIGNUP, register);
app.post('/signin', POST_SIGNIN, login);
app.get('/signout', logout);
app.use(cookieParser());
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Server on port ${PORT} started...`);
});
