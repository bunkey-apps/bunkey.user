class MessageService {

  create(body) {
    cano.log.info('create with body:', body);
  }

  get(query) {
    cano.log.info('get with query', query);
  }
  
  getById(id) {
    cano.log.info('getById with id:', id);
  }

  updateById(id, body) {
    cano.log.info('updateById with id:', id, 'and body:', body);
  }

  deleteById(id) {
    cano.log.info('deleteById with id:', id);
  }

}

module.exports = MessageService;