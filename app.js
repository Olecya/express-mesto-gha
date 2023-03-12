const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes/routes');

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

app.use((req, res, next) => {
  req.user = {
    _id: '640ccb04636fdb891f39506e',
  };

  next();
});

app.use('/', router);

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
