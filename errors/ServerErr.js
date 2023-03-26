const { serverError } = require('../utils/constants');

class ServerErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverError;
  }
}

module.exports = ServerErr;
