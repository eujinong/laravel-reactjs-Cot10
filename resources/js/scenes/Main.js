import React, { Component } from 'react';
import {
  Router, Switch
} from 'react-router-dom';

import {
  AuthAdminRoute, AuthManagerRoute, UserRoute
} from '../components/PrivateRoutes';

import Admin from './Admin';

import ManagerCategory from './Manager/category';
import ManagerContest from './Manager/contest';
import ManagerCompleted from './Manager/completed';
import ManagerDetail from './Manager/detail';
import ManagerReview from './Manager/review';
import Manager from './Manager';

import AttendContest from './Dashboard/attend';
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
          <AuthManagerRoute path="/contest/detail" name="ManagerDetail" component={ManagerDetail} />
          <AuthManagerRoute path="/contest/allreview" name="ManagerReview" component={ManagerReview} />
          <AuthManagerRoute path="/contest/activereview" name="ManagerReview" component={ManagerReview} />
          <AuthManagerRoute path="/contest" name="Manager" component={Manager} />
          
          <UserRoute path="/contests/attend" name="AttendContest" component={AttendContest} />
          <UserRoute path="/request-category" name="ReqCategory" component={ReqCategory} />
          <UserRoute path="/contests" name="contests" component={Contests} />
          <UserRoute path="/" name="Dashboard" component={Dashboard} />
        </Switch>
      </Router>
    );
  }
}

export default Main;
