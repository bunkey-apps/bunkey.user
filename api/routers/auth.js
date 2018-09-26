import Router from 'koa-router';

const { AuthController } = cano.app.controllers;
const { AuthPolicies: { localAuth, apiKey } } = cano.app.policies;

const isApigateway = apiKey('apigateway');
const router = new Router({ prefix: '/auth' });

router
      .post('/', isApigateway, localAuth, AuthController.login)
      .post('/refresh-token', isApigateway, AuthController.refreshToken)
      .post('/recovery-password', isApigateway, AuthController.recoveryPassword)
      .post('/logout', isApigateway, AuthController.logout);

module.exports = router;
