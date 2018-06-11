import Router from 'koa-router';

const { AuthController } = cano.app.controllers;
const { AuthPolicies: { localAuth } } = cano.app.policies;

const router = new Router({ prefix: '/auth' });

router
      .post('/', localAuth, AuthController.login)
      .post('/refresh-token', AuthController.refreshToken)
      .post('/logout', AuthController.logout);

module.exports = router;
