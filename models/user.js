const mongoose = require('mongoose');
// Опишем схему:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя пользователя обязательная строка'],
    minlength: [2, 'Имя пользователя: минимум 2 символа, а у вас {VALUE}'],
    maxlength: [30, 'Имя пользователя: превышенно колличесво символов'],
  },
  about: {
    type: String,
    required: [true, 'Вид деятельности обязательная строка'],
    minlength: [2, 'Вид деятельности: минимум 2 символа, а у вас {VALUE}'],
    maxlength: [30, 'Вид деятельности: превышенно колличесво символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Ссылка на аватар обязательная строка'],
  },
}, {
  versionKey: false, // You should be aware of the outcome after set to false
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
