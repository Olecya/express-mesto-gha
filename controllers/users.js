const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { JWT_KEY_SECRET } = require('../utils/config');
const NotFoundErr = require('../errors/NotFoundErr');

const idUser = (r) => {
  const { userId } = r.params;
  return userId;
};

const getUsers = async (req, res, next) => User.find({})
  .then((users) => {
    res.send(users);
  })
  .catch((e) => next(e));

const getUserId = async (req, res, next) => User.findById(idUser(req))
  .then((user) => {
    if (user) {
      res.send(user);
    } else {
      next(new NotFoundErr('Запрашиваемый пользователь не найден'));
    }
  })
  .catch((e) => next(e));

const getUserMe = async (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) res.send(user);
      if (!user) {
        next(new NotFoundErr('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((err) => next(err));
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          const { _id } = user;
          res.status(201).send({
            user: {
              _id, name, about, avatar, email,
            },
          });
        })
        .catch((err) => {
          next(err);
        });
    });
};

const patchUser = async (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundErr('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((e) => next(e));
};

const patchUserAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) res.send(user);
      else {
        next(new NotFoundErr('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((e) => next(e));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_KEY_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 });
    })
    .catch((e) => next(e));
};
module.exports = {
  createUser, getUsers, getUserId, patchUser, patchUserAvatar, login, getUserMe,
};
