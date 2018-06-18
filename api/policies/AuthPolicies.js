// import passport from 'koa-passport';
// import LocalStrategy from '../strategies/LocalStrategy';

class AuthPolicies {
    async localAuth(ctx, next) {
        const cb = async (err, accessToken, info) => {
            console.log(err);
            if (info) {
                ctx.status = 400;
                ctx.body = { message: info.message };
            } else if (err) {
                ctx.status = err.status;
                ctx.body = err;
                cano.log.error(err);
            } else {
                ctx.status = 200;
                ctx.state.data = accessToken;
                await next();
            }
        };
        return cano.passport.authenticate('local', {
            badRequestMessage: 'You must to provide all the login fields',
        }, cb)(ctx, next);
    }

    apiKey(services = []) {
        const servicesArray = Array.isArray(services) ? services : [services];
        return async (ctx, next) => {
            const cb = async (err, serviceName, invalid) => {
                if (invalid) {
                    ctx.status = 401;
                    ctx.body = invalid;
                    cano.log.error(invalid);
                } else if (err) {
                    ctx.status = err.status || 500;
                    ctx.body = err;
                    cano.log.error(err);
                } else if (servicesArray.length === 0) {
                    await next();
                } else if (servicesArray.includes(serviceName)) {
                    await next();
                } else {
                    const error = { message: 'Invalid access from another service' };
                    ctx.status = 403;
                    ctx.body = error;
                    cano.log.error(error);
                }
            };
            return cano.passport.authenticate('localapikey', cb)(ctx, next);
        };
    }

}

module.exports = AuthPolicies;
