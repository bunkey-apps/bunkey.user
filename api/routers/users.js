import Router from 'koa-router';

const { UserController, AuthController } = cano.app.controllers;
const { AuthPolicies: { localAuth } } = cano.app.policies;

const router = new Router({ prefix: '/users' });

router
      .post('/', UserController.create)
      .get('/', UserController.get)
      .get('/:id', UserController.getById)
      .put('/:id', UserController.updateById)
      .delete('/:id', UserController.deleteById);

module.exports = router
