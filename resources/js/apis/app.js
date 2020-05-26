/* eslint-disable import/no-named-as-default-member */
import ENV from '../configs/env';
import Rest from './rest';

const App = {
  filter: async (headers, response) => {
    const contentType = response.headers.get('content-type');
    const isJSON = (contentType && contentType.indexOf('application/json') !== -1);

    const body = await (isJSON ? response.json() : response.text());
    switch (response.status) {
      case 200:
      default: {
        return {
          response,
          body
        };
      }
    }
  },
  getRequestUrl: url => (
    `${ENV.API_ENDPOINT}/${url}`
  ),
  getAuth: () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      return JSON.parse(auth);
    }
    return null;
  },
  setAuth: (auth) => {
    if (auth === null) {
      localStorage.removeItem('auth');
    }
    localStorage.setItem('auth', JSON.stringify(auth));
  },
  getAuthHeader: () => {
    const auth = App.getAuth();
    const header = auth ? {
      Authorization: `Bearer ${auth.token}`
    } : {};
    return header;
  },
  get: async (url, params = {}, headers = {}) => {
    const realUrl = App.getRequestUrl(url);
    try {
      const res = await Rest.get(realUrl, params, headers);
      const json = await App.filter(headers, res);
      return json;
    } catch (error) {
      return null;
    }
  },
  post: async (url, params = {}, headers = {}) => {
    const realUrl = App.getRequestUrl(url);
    const res = await Rest.post(realUrl, params, headers);
    const data = await App.filter(headers, res);
    return data;
  },
  upload: async (url, formData, headers = {}) => {
    const realUrl = App.getRequestUrl(url);
    const res = await Rest.upload(realUrl, formData, headers);
    const data = await App.filter(headers, res);
    return data;
  },
  put: async (url, params = {}, headers = {}) => {
    const realUrl = App.getRequestUrl(url);
    try {
      const res = await Rest.put(realUrl, params, headers);
      const json = await App.filter(headers, res);
      return json;
    } catch (error) {
      return null;
    }
  },
  delete: async (url, params = {}, headers = {}) => {
    const realUrl = App.getRequestUrl(url);
    try {
      const res = await Rest.delete(realUrl, params, headers);
      const json = await App.filter(headers, res);
      return json;
    } catch (error) {
      return null;
    }
  },
};

export default App;
