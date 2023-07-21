require('dotenv').config();
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
// const helmet = require('helmet'); // TODO
const express = require('express');
const mongoose = require('mongoose');
const { errorsHandler } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO_DB } = process.env;
mongoose.connect(MONGO_DB);

const app = express();

const corsOptions = {
  origin: [
    /^https?:\/\/localhost:\d{4}$/,
    /^https?:\/\/127\.0\.0\.1:\d{4}$/,
  ],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(requestLogger); // TODO

// app.options('*', cors());

// app.post('/signup', , ); // TODO
// app.post('/signin', , ); // TODO
// app.get('signout', logout)/ // TODO
app.use(cookieParser()); // TODO
// app.use(auth); // TODO
// app.use(router); // TODO
app.use(errorLogger); // TODO
app.use(errors()); // TODO
app.use(errorsHandler); // TODO

app.listen(PORT, () => {
  console.log(`Server on port ${PORT} started...`);
});
