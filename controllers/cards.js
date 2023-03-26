const Card = require('../models/card');

const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');
const NotFoundErr = require('../errors/NotFoundErr');

const getCards = async (req, res, next) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => {
    res.send(cards);
  })
  .catch(() => {
    next(new Error(`Произошла ошибка ${req.body}`));
  });

const createCard = async (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card.create({ name, link, owner })
    .then((r) => res.status(201).send(r))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestErr('Неверные данные'));
      } else {
        next(new Error('Произошла ошибка сервера'));
      }
    });
};
const deleteCard = async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next((new NotFoundErr(`Карта не найдена ${cardId}`)));
        return;
      }
      if (userId === card.owner.toString()) {
        card.deleteOne({})
          .then(() => {
            res.send({ data: card });
          })
          .catch(() => next(new Error('Произошла ошибка сервера')));
      } else {
        next(new ForbiddenErr('Неверный пользователь'));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundErr(`Карта не найдена ${cardId}`));
      } else {
        next(new Error('Произошла ошибка сервера'));
      }
    });
};
const putCardLike = async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundErr('Запрашиваемая карточка не найдена'));
        return;
      }
      if (card) res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestErr(`Неверные данные ${cardId}`));
      } else {
        next(new Error('Произошла ошибка сервера'));
      }
    });
};

const deleteCardLike = async (req, res, next) => {
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
      if (error.name === 'CastError') {
        next(new BadRequestErr(`Неверные данные ${cardId}`));
      } else {
        next(new Error('Произошла ошибка сервера'));
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, putCardLike, deleteCardLike,
};
