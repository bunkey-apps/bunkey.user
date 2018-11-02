const baseUrl = process.env.ADMIN_SERVICE_URL;
const headers = {
  apikey: process.env.ADMIN_APIKEY,
};

class ClientService {
    async getById(id) {
      try {
        const { RequestService } = cano.app.services;
        const request = RequestService.create(baseUrl);
        const response = await request.get(`/clients/${id}`, { headers });
        return response;
      } catch (error) {
        if (error.status === 404) {
          return false;
        }
        throw error;
      }
    }
}

export default ClientService;
