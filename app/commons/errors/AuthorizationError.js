'use strict';

module.exports = class AuthorizationError extends Error {
    constructor(message, extra) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'AuthorizationError';
        this.message = message;
        if (extra) this.extra = extra
    }
};