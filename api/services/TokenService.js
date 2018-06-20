import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
// process.env.SECRET_JWT_KEY
class TokenService {

    createRefreshToken() {
        return randtoken.uid(256);
    }

    createToken(payload, expiresIn = '3d') {
        return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn });
    }
}

module.exports = TokenService;
