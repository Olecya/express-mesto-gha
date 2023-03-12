const express = require("express");
const cardRouter = express.Router();

const { getCards, createCard, deleteCard, putCardLike, deleteCardLike } = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', putCardLike);
cardRouter.delete('/:cardId/likes', deleteCardLike);

module.exports = cardRouter;
