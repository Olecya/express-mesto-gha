const { conflict } = require("../utils/constants");

class ConflictErr extends Error {
    constructor(message) {
        super(message);
        this.statusCode = conflict;
    }
}

module.exports = ConflictErr; 