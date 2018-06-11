class CustomError extends Error {
    constructor(name, message, status, code) {
        super();
        Error.captureStackTrace(this, CustomError); // Avoid includes the error constructor in the stack trace
        this.message = message;
        this.status = status;
        this.name = name;
        this.code = code
    }
}

class ErrorService {
    constructor() {
        this.CustomError = CustomError;
    }

    new(msg, status, code = 100, name = 'Error') {
        return new this.CustomError(name, msg, status, code);
    }

    mongoError(ctx, err) {
        switch (err.name) {
            case 'MongoError': {
                if (err.code === 11000) {
                    ctx.status = 409;
                    ctx.body = this.getJsonError('The User Already Exist');
                    return true;
                }
                ctx.status = 409;
                ctx.body = this.getJsonError(err.message);
                return true;
            }
            case 'ValidationError': {
                ctx.status = 400;
                ctx.body = this.getJsonError(err.message);
                return true;
            }
            default: {
                return false;
            }
        }
    }

    getJsonError(message) {
        return { message };
    }

    send(ctx, err) {
        cano.log.error(err);
        if (!this.mongoError(ctx, err)) {
            ctx.status = err.status || 500;
            ctx.body = this.getJsonError(err.message);
        }
    }
}


module.exports = ErrorService;
