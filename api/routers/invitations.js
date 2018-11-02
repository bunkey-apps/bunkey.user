import Router from 'koa-router';

const { InvitationController } = cano.app.controllers;
const { AuthPolicies: { apiKey } } = cano.app.policies;

const router = new Router({ prefix: '/invitations' });
const isApigateway = apiKey('apigateway');

router
      .post('/', isApigateway, InvitationController.create)
      .post('/validate', isApigateway, InvitationController.validate)
      .post('/answer', isApigateway, InvitationController.answer);

module.exports = router;
