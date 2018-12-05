class AuthController {

    login(ctx) {
        ctx.body = ctx.state.data;
    }

    async logout(ctx) {
        const { body: { refreshToken, _id } } = ctx.request;
        const user = await User.getById(_id, '');
        await user.removeRefreshToken(refreshToken);
        ctx.status = 204;
        return true;
    }

    async refreshToken(ctx) {
        const { body: { refreshToken } } = ctx.request;
        const accessToken = await User.refreshToken(refreshToken);
        ctx.status = 200;
        ctx.body = accessToken;
    }
    
    async recoveryPassword(ctx) {
        const { body: { email } } = ctx.request;
        await User.recoveryPassword(email);
        ctx.status = 204;
    }
}

module.exports = AuthController;
