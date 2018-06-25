// import sinon from 'sinon';
class Mocks {
  static createContext() {
    const response = {};
    const request = {
      body: {},
    };
    return {
      request,
      params: {},
      state: {},
      status: undefined,
      set: () => {},
      response,
      body: {},
    };
  }
  static getSearchResponse() {
    return {
      collection: [],
      pagination: {
        'X-Pagination-Total-Count': 100,
        'X-Pagination-Limit': 10,
     },
    };
  }
}

export default Mocks;
