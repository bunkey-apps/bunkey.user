/* eslint no-use-before-define:0*/
module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const error = CanoError.handler(validateMongoError(err));
    cano.log.error('-->', error.original);
    cano.log.error('-->', error);
    ctx.status = error.status;
    ctx.body = error.content;
  }
};

const validateMongoError = (err) => {
    switch (err.name) {
        case 'MongoError': {
            if (err.code === 11000) {
                return new UserError('UserAlreadyExist', 'The User Already Exist.');
            }
            return new UserError('UserConflict', err.message);
        }
        case 'ValidationError': {
            return new RequestError('InvalidRequestPayload', err.message);
        }
        case 'CastError': {
            return new RequestError('InvalidRequestPayload', err.message);
        }
        default: {
            return err;
        }
    }
};
