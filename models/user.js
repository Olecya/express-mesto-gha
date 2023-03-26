const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
// Опишем схему:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Имя пользователя: минимум 2 символа, а у вас {VALUE}'],
    maxlength: [30, 'Имя пользователя: превышенно колличесво символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Вид деятельности: минимум 2 символа, а у вас {VALUE}'],
    maxlength: [30, 'Вид деятельности: превышенно колличесво символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: [true,],
    validate: {
      validator: (value) => validator.isEmail(value),
      massage: 'Invalid email'
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, {
  versionKey: false, // You should be aware of the outcome after set to false
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
