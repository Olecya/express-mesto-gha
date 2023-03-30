const jwt = require('jsonwebtoken');
const { JWT_KEY_SECRET } = require('../utils/config');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (!cookie) {
    next(new UnauthorizedErr('Необходима авторизация'));
    return;
  }
  let payload;
  try {
    payload = jwt.verify(cookie, JWT_KEY_SECRET);
  } catch (err) {
    next(new UnauthorizedErr('Необходима авторизация'));
    return;
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
