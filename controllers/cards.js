const Card = require('../models/card');
const {
  badRequest, forbidden, notFound, serverError,
} = require('../utils/constants');

const getCards = async (req, res) => Card.find({})
  .then((cards) => {
    res.send(cards);
  })
  .catch((error) => {
    console.log(error);
    res.status(serverError).send({ message: `Произошла ошибка ${req.body}` });
  });

const createCard = async (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  return Card.create({ name, link, owner })
    .then((r) => res.send(r))
    .catch((error) => {
      console.log(error);
      if (error.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Неверные данные' });
      } else {
        res.status(serverError).send({ message: `Произошла ошибка ${req.body}` });
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
          .catch(() => res.status(serverError).send({ message: 'Произошла ошибка сервера' }));
      } else {
        res.status(forbidden);
        res.send({ message: 'Неверный пользователь' });
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        res.status(badRequest).send({ message: `Неверные данные ${cardId}` });
      } else {
        res.status(serverError).send({ message: `Произошла ошибка ${req.body}` });
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
        res.status(notFound);
        res.send({ message: 'Запрашиваемая карточка не найдена' });
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        res.status(badRequest).send({ message: `Неверные данные ${cardId}` });
      } else {
        res.status(serverError).send({ message: `Произошла ошибка ${req.body}` });
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
        res.status(notFound);
        res.send({ message: 'Запрашиваемая карточка не найдена' });
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        res.status(badRequest).send({ message: `Неверные данные ${cardId}` });
      } else {
        res.status(serverError).send({ message: `Произошла ошибка ${req.body}` });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, putCardLike, deleteCardLike,
};
