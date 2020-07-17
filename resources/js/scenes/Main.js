import React, { Component } from 'react';
import {
  Router, Switch
} from 'react-router-dom';

import {
  AuthAdminRoute, AuthManagerRoute, UserRoute
} from '../components/PrivateRoutes';

import AdminCategory from './Admin/category';
import AdminContest from './Admin/contest';
import AdminDetail from './Admin/detail';
import Admin from './Admin';

import ManagerCategory from './Manager/category';
import ManagerContest from './Manager/contest';
import ManagerCompleted from './Manager/completed';
import ManagerDetail from './Manager/detail';
import ManagerReview from './Manager/review';
import Manager from './Manager';

import ViewContest from './Dashboard/view';
import OverviewContest from './Dashboard/overview';
import FullviewContest from './Dashboard/fullview';
import AttendContest from './Dashboard/attend';
import ReqCategory from './Dashboard/category';
import Contests from './Dashboard/contests';
import Account from './Dashboard/account';
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
          <AuthAdminRoute path="/web/categories" name="Admin" component={AdminCategory} />
          <AuthAdminRoute path="/web/contests" name="Admin" component={AdminContest} />
          <AuthAdminRoute path="/web/detail" name="Admin" component={AdminDetail} />
          <AuthAdminRoute path="/web/settings" name="Admin" component={Admin} />
          <AuthAdminRoute path="/web" name="Admin" component={Admin} />
          
          <AuthManagerRoute path="/contest/categories" name="ManagerCategory" component={ManagerCategory} />
          <AuthManagerRoute path="/contest/contests" name="ManagerContest" component={ManagerContest} />
          <AuthManagerRoute path="/contest/completed" name="ManagerCompleted" component={ManagerCompleted} />
          <AuthManagerRoute path="/contest/detail" name="ManagerDetail" component={ManagerDetail} />
          <AuthManagerRoute path="/contest/allreview" name="ManagerReview" component={ManagerReview} />
          <AuthManagerRoute path="/contest/activereview" name="ManagerReview" component={ManagerReview} />
          <AuthManagerRoute path="/contest" name="Manager" component={Manager} />
          
          <UserRoute path="/contests/view" name="ViewContest" component={ViewContest} />
          <UserRoute path="/contests/overview" name="OverviewContest" component={OverviewContest} />
          <UserRoute path="/contests/fullview" name="FullviewContest" component={FullviewContest} />
          <UserRoute path="/contests/attend" name="AttendContest" component={AttendContest} />
          <UserRoute path="/request-category" name="ReqCategory" component={ReqCategory} />
          <UserRoute path="/contests" name="contests" component={Contests} />
          <UserRoute path="/account" name="account" component={Account} />
          <UserRoute path="/" name="Dashboard" component={Dashboard} />
        </Switch>
      </Router>
    );
  }
}

export default Main;
