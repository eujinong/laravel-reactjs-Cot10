import React, { Component } from 'react';
import {
  Router, Route, Switch
} from 'react-router-dom';

import {
  AuthAdminRoute, AuthManagerRoute
} from '../components/PrivateRoutes';

import Admin from './Admin';

import ManagerCategory from './Manager/category';
import ManagerContest from './Manager/contest';
import ManagerCompleted from './Manager/completed';
import Manager from './Manager';

import ReqCategory from './Dashboard/category';
import Contests from './Dashboard/contests'
import Dashboard from './Dashboard';

import history from '../history';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <AuthAdminRoute path="/web" name="Admin" component={Admin} />
          
          <AuthManagerRoute path="/contest/categories" name="ManagerCategory" component={ManagerCategory} />
          <AuthManagerRoute path="/contest/contests" name="ManagerContest" component={ManagerContest} />
          <AuthManagerRoute path="/contest/completed" name="ManagerCompleted" component={ManagerCompleted} />
          <AuthManagerRoute path="/contest" name="Manager" component={Manager} />
          
          <Route path="/request-category" name="ReqCategory" component={ReqCategory} />
          <Route path="/contests" name="contests" component={Contests} />
          <Route path="/" name="Dashboard" component={Dashboard} />
        </Switch>
      </Router>
    );
  }
}

export default Main;
