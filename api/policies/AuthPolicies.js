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
}

module.exports = AuthPolicies;
