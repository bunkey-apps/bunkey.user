import Router from 'koa-router';

const { UserController } = cano.app.controllers;
const { AuthPolicies: { apiKey } } = cano.app.policies;

const router = new Router({ prefix: '/users' });
const isApigateway = apiKey('apigateway');

router
      .post('/', isApigateway, UserController.create)
      .get('/', isApigateway, UserController.get)
      .get('/:id', isApigateway, UserController.getById)
      .put('/:id', isApigateway, UserController.updateById)
      .delete('/:id', isApigateway, UserController.deleteById);

module.exports = router;
