import { Strategy } from 'passport-local';


// console.log(cano.app);

/**
 * Local Strategy Passport Configuration
 *
 * @class LocalStrategy
 * @author Antonio Mejias
 *
 */
class LocalStrategy extends Strategy {
    constructor() {
        super(LocalStrategy.options(), LocalStrategy.verify)
    }

    static options() {
        return {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        };
    }

    static async verify(email, password, done) {
        try {
            const { User } = cano.app.models;
            const { TokenService, ErrorService } = cano.app.services;

            let user = await User.findOne({ email }).select('id role password refreshTokens');

            if (!user || !user.isValidPassword(password)) {
                throw ErrorService.new('The credentials are invalid', 401);
            }

            const refreshToken = TokenService.createRefreshToken();
            await user.addRefreshToken(refreshToken);
            user = user.toObject();
            delete user.password;
            delete user.refreshTokens;
            const accessToken = TokenService.createToken(user);

            return done(null, { accessToken, refreshToken });
        } catch (e) {
            return done(e, null);
        }
    }
}

module.exports = LocalStrategy;
