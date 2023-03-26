const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');

const { urlValidator } = require('../utils/urlValidator')


const routerUsers = express.Router();

const {
  getUsers, getUserId, patchUser, patchUserAvatar, getUserMe,
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/me',  celebrate({
  [Segments.COOKIES]: Joi.object().keys({
    jwt: Joi.string().required(),
  }),
}), getUserMe);
routerUsers.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserId);

routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).custom(urlValidator),
  }),
}), patchUser);

routerUsers.patch('/me/avatar',celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).custom(urlValidator),
  }),
}), patchUserAvatar);

module.exports = routerUsers;

// { createUser, getUsers, getUser, patchUser, patchUserAvatar }
