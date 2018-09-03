const baseUrl = process.env.ADMIN_SERVICE_URL;
const headers = {
  apikey: process.env.ADMIN_APIKEY,
};

class ClientService {
    async existClientById(id) {
      try {
        const { RequestService } = cano.app.services;
        const request = RequestService.create(baseUrl);
        const response = await request.get(`/clients/${id}`, { headers });
        cano.log.debug('ClientService -> existClientById -> response', response);
        return true;
      } catch (error) {
        cano.log.error('ClientService -> existClientById -> error', error);
        if (error.status === 404) {
          return false;
        }
        throw error;
      }
    }
}

export default ClientService;
