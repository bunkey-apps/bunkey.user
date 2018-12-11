import Router from 'koa-router';

const { UserController } = cano.app.controllers;
const { AuthPolicies: { apiKey } } = cano.app.policies;

const router = new Router({ prefix: '/users' });
const isApigateway = apiKey('apigateway');

router
      .post('/', isApigateway, UserController.create)
      .get('/', apiKey(['apigateway', 'object']), UserController.get)
      .get('/:id', apiKey(['apigateway', 'object']), UserController.getById)
      .put('/:id', isApigateway, UserController.updateById)
      .delete('/:id', isApigateway, UserController.deleteById)
      .delete('/:id/work-clients/:client', isApigateway, UserController.removeWorkClient);

module.exports = router;
