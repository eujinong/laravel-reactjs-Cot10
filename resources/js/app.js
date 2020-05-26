import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Router, Route, Redirect, Switch
} from 'react-router-dom';

import history from './history';
import Main from './scenes/Main';

import AdminSignin from './scenes/Admin/Signin';

import ManagerSignin from './scenes/Manager/Signin';
import ManagerSignup from './scenes/Manager/Signup';

import Signup from './scenes/Auth/Signup';
import Forgot from './scenes/Auth/Forgot';
import Reset from './scenes/Auth/Reset';

import {
  login
} from './actions/common';
import Api from './apis/app';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    };
  }

  async componentDidMount() {
    const auth = Api.getAuth();
    if (auth !== null) {
      await this.props.login(auth);
    }
    this.setState({
      initialized: true
    });
  }

  render() {
    const {
      initialized
    } = this.state;
    return (
      initialized ? (
        <Router history={history}>
          <Switch>
            <Route path="/web/signin" name="AdminSignin" component={AdminSignin} />
            <Route path="/contest/signin" name="ManagerSignin" component={ManagerSignin} />
            <Route path="/contest/signup" name="ManagerSignup" component={ManagerSignup} />
          
            <Route path="/forgot" name="Forgot" component={Forgot} />
            <Route path="/reset/:token" name="Reset" component={Reset} />

            <Route path="/signup" name="signup" component={Signup} />
            <Route path="/" name="Main" component={Main} />

            <Redirect from="*" to="/" />
          </Switch>
        </Router>
      ) : null
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
