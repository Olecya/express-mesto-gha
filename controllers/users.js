const User = require("../models/user");

const getUsers = async (req, res) => {
  return User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: `Произошла ошибка ${req.body}` })
    });
};

const getUserId = async (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (Boolean(user)) res.send(user);
      if (!Boolean(user)) {
        res.status(404);
        res.send("Запрашиваемый пользователь не найден");
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: `Неверные данные` })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${req.body}` })
      }
    });
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  return User.create({ name, about, avatar })
    .then(req => res.send(req))
    .catch((error) => {
      console.log(error.name, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Неверные данные` })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${req.body}` })
      }
    });
};

const patchUser = async (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (Boolean(user)) res.send(user);
      if (!Boolean(user)) {
        res.status(404);
        res.send("Запрашиваемый пользователь не найден");
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Неверные данные` })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${req.body}` })
      }
    });
}
const patchUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (Boolean(user)) res.send(user);
      if (!Boolean(user)) {
        res.status(404);
        res.send("Запрашиваемый пользователь не найден");
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        res.status(400).send({ message: `Неверные данные` })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${req.body}` })
      }
    });
}

module.exports = { createUser, getUsers, getUserId, patchUser, patchUserAvatar };
