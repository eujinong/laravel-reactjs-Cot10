import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Store from '../store';

export const AuthAdminRoute = ({ component: Component, ...rest }) => {
  const { auth } = Store.getState().common;
  return (
    <Route
      {...rest}
      render={props => (auth
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/web/signin', state: { from: props.location } }} />)}
    />
  );
};

export const AuthManagerRoute = ({ component: Component, ...rest }) => {
  const { auth } = Store.getState().common;
  return (
    <Route
      {...rest}
      render={props => (auth || props.location.pathname == '/contest/signup'
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/contest/signin', state: { from: props.location } }} />)}
    />
  );
};