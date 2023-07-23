const DEFAULT_MESSAGE_FOR_HTTP_CODE_BAD_REQUEST = 'Переданы некорректные данные';
const DEFAULT_MESSAGE_FOR_HTTP_CODE_UNAUTHORIZED = 'Ошибка аутентификации';
const DEFAULT_MESSAGE_FOR_HTTP_CODE_FORBIDDEN = 'Отказано в доступе';
const DEFAULT_MESSAGE_FOR_HTTP_CODE_NOT_FOUND = 'Объект не найден';
const DEFAULT_MESSAGE_FOR_HTTP_CODE_CONFLICT = 'Объект уже существует';
const DEFAULT_MESSAGE_FOR_HTTP_CODE_INTERNAL_SERVER_ERROR = 'На сервере произошла ошибка';

const WRONG_EMAIL_OR_PASSWORD = 'Неправильные email или пароль';
const USER_WITH_EMAIL_ALREADY_EXISTS = 'Пользователь с таким email уже зарегистрирован';
const ATTEMPT_TO_DELETE_MOVIE_FOR_ANOTHER_USER = 'Можно удалять только собственные сохраненные фильмы';

module.exports = {
  DEFAULT_MESSAGE_FOR_HTTP_CODE_BAD_REQUEST,
  DEFAULT_MESSAGE_FOR_HTTP_CODE_UNAUTHORIZED,
  DEFAULT_MESSAGE_FOR_HTTP_CODE_FORBIDDEN,
  DEFAULT_MESSAGE_FOR_HTTP_CODE_NOT_FOUND,
  DEFAULT_MESSAGE_FOR_HTTP_CODE_CONFLICT,
  DEFAULT_MESSAGE_FOR_HTTP_CODE_INTERNAL_SERVER_ERROR,

  WRONG_EMAIL_OR_PASSWORD,
  USER_WITH_EMAIL_ALREADY_EXISTS,
  ATTEMPT_TO_DELETE_MOVIE_FOR_ANOTHER_USER,
};
