const { badRequest } = require("../utils/constants");

class BadRequestErr extends Error {
    constructor(message) {
        super(message);
        this.statusCode = badRequest;
    }
}

module.exports = BadRequestErr; 