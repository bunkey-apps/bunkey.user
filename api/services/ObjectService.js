const baseUrl = process.env.OBJECT_SERVICE_URL;
const headers = {
  apikey: process.env.OBJECT_APIKEY,
};

class ObjectService {
  async createWorkspace(user, client) {
    const request = RequestService.create(baseUrl);
    const response = await request.post(`/users/${user}/clients/${client}/favorites`, {}, { headers });
    return response;
  }

  async deleteWorkspace(user, client) {
    const request = RequestService.create(baseUrl);
    const response = await request.delete(`/users/${user}/clients/${client}/favorites`, {}, { headers });
    return response;
  }

  async createUser(body) {
    const request = RequestService.create(baseUrl);
    const response = await request.post('/users', body, { headers });
    return response;
  }

  async updateUser(id, body) {
    const request = RequestService.create(baseUrl);
    const response = await request.put(`/users/${id}`, body, { headers });
    return response;
  }

  async deleteUser(id) {
    const request = RequestService.create(baseUrl);
    const response = await request.delete(`/users/${id}`, {}, { headers });
    return response;
  }
}

export default ObjectService;
