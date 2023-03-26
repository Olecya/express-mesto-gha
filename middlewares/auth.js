const jwt = require('jsonwebtoken');
const { JWT_KEY_SECRET } = require('../utils/config');

const handleAuthError = (res) => {
    res.status(401).send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {

    const { cookie } = req.headers;
    if (!cookie || !cookie.startsWith('jwt=')) {
        return handleAuthError(res);
    }
    const token = cookie.replace('jwt=', '');
    // console.log(token);
    let payload;
    try {
        payload = jwt.verify(token, JWT_KEY_SECRET);
        // console.log(payload._id, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    } catch (err) {
        console.log(err);
        return handleAuthError(res);
    }
    req.user = payload; // записываем пейлоуд в объект запроса
    next(); // пропускаем запрос дальше
};
