const { unauthorized } = require("../utils/constants");

class UnauthorizedErr extends Error {
    constructor(message) {
        super(message);
        this.statusCode = unauthorized;
    }
}

module.exports = UnauthorizedErr; 