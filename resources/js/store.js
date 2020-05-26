import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import reducers from './reducers';
import history from './history';
import fetchInterceptor from './interceptors/fetch';

const historyRouterMiddleware = routerMiddleware(history);

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(historyRouterMiddleware, thunkMiddleware);
  }
  return applyMiddleware(historyRouterMiddleware, thunkMiddleware, createLogger());
};

export const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  composeWithDevTools(
    fetchInterceptor(),
    getMiddleware()
  )
);

export default store;
