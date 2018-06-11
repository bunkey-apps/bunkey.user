import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
// process.env.SECRET_JWT_KEY
class TokenService {

    createRefreshToken() {
        return randtoken.uid(256);
    }

    createToken(payload, expiresIn = '3d') {
        return jwt.sign(payload, 'my-secret-key', { expiresIn });
    }
}

module.exports = TokenService;
