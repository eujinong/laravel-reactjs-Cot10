/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, { Component, Fragment } from 'react';
import {
  withRouter
} from 'react-router-dom';
import {
  Container, Row, Col
} from 'reactstrap';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    return (
      <Fragment>
        <div className="dashboard">
          <Container>
            <Row>
              <Col className="text-center mt-5" sm="12">
                <a className="btn btn-success" href="/signup">Member Signup</a>
              </Col>
              <Col className="text-center mt-5" sm="12">
                <a className="btn btn-secondary" href="/request-category">Request Category</a>
              </Col>
            </Row>
          </Container>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Dashboard);