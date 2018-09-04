const { User } = cano.app.models;

class UserController {

    async create(ctx) {
        const { body } = ctx.request;
        cano.log.debug('body', body);
        const user = await User.create(body);
        ctx.status = 201;
        ctx.body = user;
    }

    async get(ctx) {
        const { collection, pagination } = await User.get(ctx.request.query);
        ctx.set('X-Pagination-Total-Count', pagination['X-Pagination-Total-Count']);
        ctx.set('X-Pagination-Limit', pagination['X-Pagination-Limit']);
        ctx.status = 200;
        ctx.body = collection;
    }

    async getById(ctx) {
        const { id } = ctx.params;
        ctx.status = 200;
        ctx.body = await User.getById(id);
    }

    async updateById(ctx) {
        const { UserService } = cano.app.services;
        const { id } = ctx.params;
        const { body } = ctx.request;
        await UserService.update({
            ...body,
            id,
        });
        ctx.status = 204;
    }

    async deleteById(ctx) {
        const { id } = ctx.params;
        await User.deleteById(id);
        ctx.status = 204;
    }

}

module.exports = UserController;
