/* eslint-disable no-param-reassign */
import { logout, login } from '../actions/common';
// import history from '../history';
import Api from '../apis/app';

const fetchInterceptor = (fetchContext = global) => {
  const _fetch = fetchContext.fetch;

  return createStore => (reducer, initialState, enhancer) => {
    const store = createStore(reducer, initialState, enhancer);

    fetchContext.fetch = async (url, options) => {
      options.headers = {
        ...(options.headers || {}),
        ...Api.getAuthHeader()
      };
      const res = await _fetch(url, options);
      switch (res.status) {
        case 400:
        case 401:
          await logout()(store.dispatch);
          break;
        case 403: {
          const body = await res.json();
          if (body.data && body.data.auth) {
            await login(body.auth)(store.dispatch);
          } else {
            await logout()(store.dispatch);
          }
          break;
        }
        default:
          break;
      }
      return res;
    };

    return store;
  };
};

export default fetchInterceptor;
