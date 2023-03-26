const { notFound } = require('../utils/constants');

class NotFoundErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = notFound;
  }
}

module.exports = NotFoundErr;
