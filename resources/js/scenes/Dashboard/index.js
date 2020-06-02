/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, { Component, Fragment } from 'react';
import {
  bindActionCreators
} from 'redux';
import {
  connect
} from 'react-redux';
import {
  withRouter
} from 'react-router-dom';
import {
  Container, Row, Col
} from 'reactstrap';

import { logout } from '../../actions/common';

import Bitmaps from '../../theme/Bitmaps';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout() {
    await this.props.logout();

    this.props.history.push('/signin');
  }

  render() {
    
    return (
      <Fragment>
        <div className="top-header tile-top-bar">
          <a href="/">
            <img src={Bitmaps.logo} alt="Cot10" />
          </a>
        </div>

        <div className="dashboard">
          <Container>
            <Row>
              <Col className="text-center mt-5" sm="12">
                <a className="btn btn-success" href="/signup">Member Signup</a>
              </Col>
              <Col className="text-center mt-5" sm="12">
                <a className="btn btn-secondary" href="/request-category">Request Category</a>
              </Col>
              <Col className="text-center mt-5" sm="12">
                <a className="btn btn-info" href="" onClick={this.handleLogout}>Sign out</a>
              </Col>
            </Row>
          </Container>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = () => ({
});
const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(logout, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));