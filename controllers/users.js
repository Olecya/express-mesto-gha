const User = require('../models/user');
const {
  badRequest, notFound, serverError,
} = require('../utils/constants');

const getUsers = async (req, res) => User.find({})
  .then((users) => {
    res.send(users);
  })
  .catch((error) => {
    console.log(error.name);
    res.status(serverError).send({ message: `Произошла ошибка ${req.body}` });
  });

const getUserId = async (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (user) res.send(user);
      if (!user) {
        res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(badRequest).send({ message: 'Неверные данные' });
      } else {
        res.status(serverError).send({ message: `Произошла ошибка ${req.body}` });
      }
    });
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  return User.create({ name, about, avatar })
    .then((r) => res.send(r))
    .catch((error) => {
      // не разобралась что и за что отвечает
      // const err = User.validateSync();
      // assert.equal(err.errors['name'].message,
      //   'Must be at least 6, got 2');
      // assert.equal(error.errors['about'].message, 'Milk is not supported');
      // console.log(assert.equal(err.errors['name'].message,
      //   'Имя пользователя: минимум 2 символа, а у вас {VALUE}'));
      if (error.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Неверные данные' });
      } else {
        res.status(serverError).send({ message: `Произошла ошибка ${req.body}` });
      }
    });
};

const patchUser = async (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) res.send(user);
      if (!user) {
        res.status(notFound);
        res.send('Запрашиваемый пользователь не найден');
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Неверные данные' });
      } else {
        res.status(serverError).send({ message: `Произошла ошибка ${req.body}` });
      }
    });
};
const patchUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) res.send(user);
      if (!user) {
        res.status(notFound);
        res.send('Запрашиваемый пользователь не найден');
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        res.status(badRequest).send({ message: 'Неверные данные' });
      } else {
        res.status(serverError).send({ message: `Произошла ошибка ${req.body}` });
      }
    });
};

module.exports = {
  createUser, getUsers, getUserId, patchUser, patchUserAvatar,
};
