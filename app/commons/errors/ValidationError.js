'use strict';

module.exports = class ValidationError extends Error {
    constructor(message, extra) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'ValidationError';
        this.message = message;
        if (extra) this.extra = extra
    }
};