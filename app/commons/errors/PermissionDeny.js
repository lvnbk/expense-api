'use strict';

module.exports = class PermissionDeny extends Error {
    constructor(message, extra) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'PermissionDeny';
        this.message = message;
        if (extra) this.extra = extra
    }
};