// import passport from 'koa-passport';
// import LocalStrategy from '../strategies/LocalStrategy';

class AuthPolicies {
    async localAuth(ctx, next) {
        const cb = async (err, accessToken, missingCredentials) => {
            if (missingCredentials) {
                throw new RequestError('MissingFields', 'You have missing some credentials fields.');
            } else if (err) {
                throw err;
            } else {
                ctx.status = 200;
                ctx.state.data = accessToken;
                await next();
            }
        };
        return cano.passport.authenticate('local', cb)(ctx, next);
    }

    apiKey(services = []) {
        const servicesArray = Array.isArray(services) ? services : [services];
        return async (ctx, next) => {
            const cb = async (err, serviceName, invalid) => {
                if (invalid) {
                    throw new AuthorizationError('Unauthorized', invalid.message);
                } else if (err) {
                    throw err;
                } else if (servicesArray.length === 0) {
                    await next();
                } else if (servicesArray.includes(serviceName)) {
                    await next();
                } else {
                    throw new AuthorizationError('InvalidAccess', 'Invalid access from another service');
                }
            };
            return cano.passport.authenticate('localapikey', cb)(ctx, next);
        };
    }

}

module.exports = AuthPolicies;
