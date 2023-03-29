const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const router = require('./routes/routes');
const BadRequestErr = require('./errors/BadRequestErr');
const ConflictErr = require('./errors/ConflictErr');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected');
  })
  .catch((error) => {
    console.log(`Error during connection ${error}`);
  });
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', router);

app.use(errors());
app.use((err, req, res, next) => {
  let error = err;
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    error = new BadRequestErr('Неверные данные запроса');
  }
  if (err.code === 11000) {
    error = new ConflictErr('Пользователь с такими e-mail уже существует');
  }
  if (error.statusCode === 500 || !error.statusCode) {
    error.statusCode = 500;
    error.message = 'Произошла ошибка сервера';
  }
  const massageErr = error.message;
  res.status(error.statusCode).send({ massageErr });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
