const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { UnauthorizedError } = require('../middlewares/errors');
const { WRONG_EMAIL_OR_PASSWORD } = require('../utils/errorMessages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(text) {
        return validator.isEmail(text);
      },
    },
    message: 'Неправильный формат почты',

  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD));
          }

          return user;
        });
    });
};

userSchema.methods.copyWithoutPassword = function () {
  const { password, ...userWithoutPassword } = this.toObject();
  return userWithoutPassword;
};

module.exports = mongoose.model('user', userSchema);
