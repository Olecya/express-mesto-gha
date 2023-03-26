const { forbidden } = require("../utils/constants");

class ForbiddenErr extends Error {
    constructor(message) {
        super(message);
        this.statusCode = forbidden;
    }
}

module.exports = ForbiddenErr; 