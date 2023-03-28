const jwt = require('jsonwebtoken');
const { JWT_KEY_SECRET } = require('../utils/config');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

module.exports = (req, res, next) => {
  // const { cookie } = req.cookies.jwt;
  // console.log(req.cookies.jwt)
  // if (!cookie || !cookie.startsWith('jwt=')) {
  //   next(new UnauthorizedErr('Необходима авторизация'));
  //   return;
  // }
  // const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, JWT_KEY_SECRET);
  } catch (err) {
    next(new UnauthorizedErr('Необходима авторизация'));
    return;
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
