const Card = require('../models/card');

const BadRequestErr = require('../errors/BadRequestErr');
const UnauthorizedErr = require('../errors/UnauthorizedErr');
const ForbiddenErr = require('../errors/ForbiddenErr');
const NotFoundErr = require('../errors/NotFoundErr');
const ConflictErr = require('../errors/ConflictErr');
const ServerErr = require('../errors/ServerErr');

const getCards = async (req, res) => Card.find({})
  .then((cards) => {
    res.send(cards);
  })
  .catch(() => {
    next(new ServerErr(`Произошла ошибка ${req.body}`))
  });

const createCard = async (req, res) => {
  const owner = req.user._id
  const { name, link, } = req.body;
  return Card.create({ name, link, owner })
    .then((r) => res.send(r))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestErr('Неверные данные'));
      } else {
        next(new ServerErr(`Произошла ошибка сервера`));
      }
    });
};
const deleteCard = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (Boolean(card) && userId === card.owner.toString()) {
        card.deleteOne({})
          .then(() => res.send({ data: card }))
          .catch(() => next(new ServerErr(`Произошла ошибка сервера`)));
      } else {
        next(new ForbiddenErr('Неверный пользователь'))
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        next(new BadRequestErr(`Неверные данные ${cardId}`))
      } else {
        next(new ServerErr(`Произошла ошибка сервера`));
      }
    });
};
const putCardLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (card) res.send({ data: card });
      if (!card) {
        next(new NotFoundErr('Запрашиваемая карточка не найдена'));
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        next(new BadRequestErr(`Неверные данные ${cardId}`))
      } else {
        next(new ServerErr(`Произошла ошибка сервера`));
      }
    });
};

const deleteCardLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) res.send({ data: card });
      if (!card) {
        next(new NotFoundErr('Запрашиваемая карточка не найдена'));
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        next(new BadRequestErr(`Неверные данные ${cardId}`))
      } else {
        next(new ServerErr(`Произошла ошибка сервера`));
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, putCardLike, deleteCardLike,
};
