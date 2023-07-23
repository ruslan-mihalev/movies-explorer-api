
Репозиторий для API аттестационного проекта курса Web-разработчик.

IP 158.160.6.157

Backend https://api.kinopoisk.nomoredomains.xyz

### Продемонстрирована работа с сетью

#### возвращает информацию о пользователе (email и имя)
```GET /users/me```

#### обновляет информацию о пользователе (email и имя)
```PATCH /users/me```

#### возвращает все сохранённые текущим  пользователем фильмы
```GET /movies```

#### создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
```POST /movies```

#### удаляет сохранённый фильм по id
```DELETE /movies/_id```

#### создаёт пользователя с переданными в теле email, password и name
```POST /signup```

#### проверяет переданные в теле почту и пароль и возвращает JWT
```POST /signin```
