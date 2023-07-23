require('dotenv').config();
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
// const helmet = require('helmet'); // TODO
const express = require('express');
const mongoose = require('mongoose');
const { errorsHandler } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { POST_SIGNUP, POST_SIGNIN } = require('./utils/validators');
const { register, login, logout } = require('./controllers/users');

const { PORT = 3000, MONGO_DB } = process.env;
mongoose.connect(MONGO_DB);

const app = express();

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
app.use(cookieParser()); // TODO
// app.use(auth); // TODO
// app.use(router); // TODO
app.use(errorLogger); // TODO
app.use(errors()); // TODO
app.use(errorsHandler); // TODO

app.listen(PORT, () => {
  console.log(`Server on port ${PORT} started...`);
});
