import { Strategy } from 'passport-local';

/**
 * Local Strategy Passport Configuration
 *
 * @class LocalStrategy
 * @author Antonio Mejias
 *
 */
class LocalStrategy extends Strategy {
    constructor() {
        super(LocalStrategy.options(), LocalStrategy.verify);
    }

    /**
     * @method options
     * @description This method is a getter for the options to configure the Strategy
     * @author Antonio Mejias
     */
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
            let user = await User.findOne({ email }).select('id role password refreshTokens');

            if (!user || !user.isValidPassword(password)) {
                throw new RequestError('InvalidCredentials', 'The credentials are invalids.');
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
