import pick from 'lodash/pick';

const modelFields = [
    'email',
    'name',
    'avatar',
    'role',
    'workspace',
    'status',
    'workClients',
    'clientOwner',
    'status',
  ];

class UserController {

    async create(ctx) {
        const { body } = ctx.request;
        cano.log.debug('body', body);
        const user = await User.create(body);
        await ObjectService.createUser(user);
        ctx.status = 201;
        ctx.body = pick(user, modelFields);
    }

    async get(ctx) {
        cano.log.debug('Here');
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
        // await ObjectService.updateUser(id, body);
        ctx.status = 204;
    }

    async deleteById(ctx) {
        const { id } = ctx.params;
        await User.deleteById(id);
        await ObjectService.deleteUser(id);
        ctx.status = 204;
    }

    async removeWorkClient(ctx) {
        const { id, client } = ctx.params;
        const user = await User.getById(id);
        await user.removeWorkClient(client);
        ctx.status = 204;
    }

}

module.exports = UserController;
