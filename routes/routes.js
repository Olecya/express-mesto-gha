const router = require('express').Router();
const { notFound } = require('../utils/constants');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(notFound).send({ message: '404 Not Found' });
});

module.exports = router;
