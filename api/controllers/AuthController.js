const { User } = cano.app.models;
const { ErrorService } = cano.app.services;

class AuthController {

    login(ctx) {
        ctx.body = ctx.state.data;
    }

    async logout(ctx) {
        try {
            const { body: { refreshToken, _id } } = ctx.request;
            const user = await User.getById(_id, '');
            await user.removeRefreshToken(refreshToken);
            ctx.status = 204;
            return true;
        } catch (e) {
            ErrorService.send(ctx, e);
        }
    }

    async refreshToken(ctx) {
        try {
            const { body: { refreshToken } } = ctx.request;
            const accessToken = await User.refreshToken(refreshToken);
            console.log(accessToken);
            ctx.status = 200;
            ctx.body = accessToken;
        } catch (e) {
            console.log();
            ErrorService.send(ctx, e);
        }
	}
}

module.exports = AuthController;
