const card = require("../models/card");
const Card = require("../models/card");

const getCards = async (req, res) => {
  return Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: `Произошла ошибка ${req.body}` })
    });
};

const createCard = async (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  return Card.create({ name, link, owner })
    .then(req => res.send(req))
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: `Произошла ошибка ${req.body}` })
    });
};
const deleteCard = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  card.findById(cardId)
    .then((card) => {
      console.log(Boolean(card), 'cards.js/controllers 35 line')
      if (Boolean(card) && userId === card.owner.toString()) {
        card.deleteOne({})
          .then(() => res.send({ data: card }));
      } else {
        res.status(404);
        res.send("Запрашиваемый пользователь не найден");
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        res.status(400).send({ message: `Неверные данные ${cardId}` })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${req.body}` })
      }
    });
}
const putCardLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (Boolean(card)) res.send({ data: card });
      if (!Boolean(card)) {
        res.status(404);
        res.send("Запрашиваемый пользователь не найден");
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.name === 'CastError') {
        res.status(400).send({ message: `Неверные данные ${cardId}` })
      } else {
        res.status(500).send({ message: `Произошла ошибка ${req.body}` })
      }
    });
}

const deleteCardLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } }, // убрать _id из массива
    { new: true },
  )
  .then((card) => {
    if (Boolean(card)) res.send({ data: card });
    if (!Boolean(card)) {
      res.status(404);
      res.send("Запрашиваемый пользователь не найден");
    }
  })
  .catch((error) => {
    console.log(error);
    if (error.name === 'CastError') {
      res.status(400).send({ message: `Неверные данные ${cardId}` })
    } else {
      res.status(500).send({ message: `Произошла ошибка ${req.body}` })
    }
  });
}

module.exports = { getCards, createCard, deleteCard, putCardLike, deleteCardLike };