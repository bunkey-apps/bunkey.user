const { MessageService } = cano.app.services;

class AuthPolice {

  async apikey({ request, res }, next) {
    const { body } = request;
    cano.log.info('AuthPolice');
    res.body = request;
    if (body.token) {
      await next();
    } else if (request.query) {
      await next();
    } else {
      await next(new Error('Tocken not found'));
    }
  }

}

module.exports = AuthPolice;