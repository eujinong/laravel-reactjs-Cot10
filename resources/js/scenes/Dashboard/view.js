import React, { Component, Fragment } from 'react';
import {
  withRouter
} from 'react-router-dom';

import {
  Container, Row, Col,
  Alert, Button
} from 'reactstrap';

import Bitmaps from '../../theme/Bitmaps';

import Menu from '../../components/Menu';

import Api from '../../apis/app';

class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contest: [],
      part:[],
      init: true
    }
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('auth'));
    const contest_id = this.props.location.state;

    if (contest_id === undefined) {
      this.props.history.push('/web/contests');
    } else {
      const params = {
        contest_id,
        member_id: user.user.member_info.id
      }
      
      const data = await Api.get('get-contest', params);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          this.setState({
            contest: body.contest,
            part: body.part,
            init: false
          });
          break;
        default:
          break;
      }
    }
  }

  handleAttend(id) {
    this.props.history.push('/contests/attend', id);
  }

  handleAccount() {
    this.props.history.push('/account');
  }

  handleSignout() {
    localStorage.removeItem('auth');

    this.props.history.push('/signin');
  }

  render() {
    const { 
      contest, part, init
    } = this.state;

    return (
      <Fragment>
        <div className="top-header tile-top-bar">
          <a href="/">
            <img src={Bitmaps.logo} alt="Cot10" />
          </a>
          <a
            className="mt-3 mr-5"
            style={{float:"right",cursor:"pointer"}}
            onClick={this.handleSignout.bind(this)}
          >
            <i className="fa fa-logout"></i> Sign Out
          </a>
          <a
            className="mt-3 mr-5"
            style={{float:"right",cursor:"pointer"}}
            onClick={this.handleAccount.bind(this)}
          >
            <i className="fa fa-user"></i> Account
          </a>
        </div>

        <Menu />
        
        <div className="dashboard">
          <Container>
            <Row>
              <Col sm="12">
                <Alert color="info">
                  <Row className="mb-3">
                    <Col sm="12"><h4>Title: {contest.name}</h4></Col>
                  </Row>
                  <Row className="my-3">
                    <Col sm="6"><h4>Major Category: {contest.major}</h4></Col>
                    <Col sm="6"><h4>Sub Category: {contest.sub}</h4></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm="6"><h4>Creator Name: {contest.username}</h4></Col>
                    <Col sm="6"><h4>Creator Email: {contest.email}</h4></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm="6"><h4>Start Date: {contest.start_date}</h4></Col>
                    <Col sm="6"><h4>Round Days: {contest.round_days} days</h4></Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm="12">
                      <h4>Gole:</h4>
                      <p className="pl-4">{contest.gole}</p>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm="12">
                      <h4>Rule:</h4>
                      <p className="pl-4">{contest.rule}</p>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm="12">
                      <h4>Ending:</h4>
                      <p className="pl-4">{contest.ending}</p>
                    </Col>
                  </Row>
                  {
                    contest && contest.note && (
                      <Row className="mb-3">
                        <Col sm="12">
                          <h4>Note:</h4>
                          <p className="pl-4">{contest.note}</p>
                        </Col>
                      </Row>
                    )
                  }
                  
                </Alert>
              </Col>
              {
                !init && part.length == 0 && (
                  <Col sm="12">
                    <div className="w-100 d-flex justify-content-center my-3">
                      <Button
                        type="button"
                        color="success"
                        onClick={this.handleAttend.bind(this, contest.id)}
                      >
                        <i className="fa fa-users"></i> Join Contest
                      </Button>
                    </div>
                  </Col>
                )
              }
            </Row>
          </Container>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(View);