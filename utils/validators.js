const { celebrate, Joi, Segments } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const IMAGE_URL_REGEX = /^https?:\/\/[w{3}]?[\w\-\.]+\.[a-z]{2,}[\(\)\[\]\w\.,;:'~\-\+\*\/=\?!@\$&#%]*$/i; //eslint-disable-line

/**
 * Original: (https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/)
 */
const isValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    return String(new ObjectId(id)) === id;
  }
  return false;
};
const createObjectIdValidator = (paramName) => (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message(`Invalid param type. '${paramName}' have to be 'mongoose.Types.ObjectId'`);
  }
  return value;
};

const POST_SIGNUP = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const POST_SIGNIN = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const PATCH_USER_ME = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const POST_MOVIE = celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().min(4).max(4).required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(IMAGE_URL_REGEX),
    trailerLink: Joi.string().required().regex(IMAGE_URL_REGEX),
    thumbnail: Joi.string().required().regex(IMAGE_URL_REGEX),
    owner: Joi.string().required().custom(createObjectIdValidator('owner._id')),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const DELETE_MOVIE = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    movieId: Joi.string().required().custom(createObjectIdValidator('_id')),
  }),
});
