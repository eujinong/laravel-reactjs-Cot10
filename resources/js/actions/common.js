import Types from './types';
import Api from '../apis/app';

export const login = auth => (
  (dispatch) => {
    Api.setAuth(auth);
    return dispatch({
      type: Types.LOGIN, auth
    });
  }
);

export const logout = () => (
  (dispatch) => {
    Api.setAuth(null);
    return dispatch({
      type: Types.LOGOUT
    });
  }
);
