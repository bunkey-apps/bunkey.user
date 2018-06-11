const { ErrorService } = cano.app.services;
const { User } = cano.app.models;

class UserController {

  async create(ctx) {
      try {
          const { body } = ctx.request;
          const user = await User.create(body);
          ctx.status = 201;
          ctx.body = user;
      } catch (e) {
         ErrorService.send(ctx, e);
      }
  }

  async get(ctx) {
    const { collection, pagination } = await User.get(ctx.request.query);
	ctx.set('X-Pagination-Total-Count', pagination['X-Pagination-Total-Count']);
	ctx.set('X-Pagination-Limit', pagination['X-Pagination-Limit']);
	ctx.status = 200;
	ctx.body = collection;
  }

  async getById(ctx) {
      try {
          const { id } = ctx.params;
          ctx.status = 200;
          ctx.body = await User.getById(id);
      } catch (e) {
         ErrorService.send(ctx, e);
      }
  }

  async updateById(ctx) {
      try {
          const { UserService } = cano.app.services;
          const { id } = ctx.params;
          const { body } = ctx.request;
          await UserService.update({ ...body, id });
          ctx.status = 204;
      } catch (e) {
          ErrorService.send(ctx, e);
      }
  }

  async deleteById(ctx) {
      try {
          const { id } = ctx.params;
          await User.deleteById(id);
          ctx.status = 204;
      } catch (e) {
          ErrorService.send(ctx, e);
      }
  }

}

module.exports = UserController;
