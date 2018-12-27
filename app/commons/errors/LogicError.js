'use strict';

module.exports = class LogicError extends Error {
    constructor(message, extra) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'LogicError';
        this.message = message;
        if (extra) this.extra = extra
    }
};