/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {
  Component, Fragment
} from 'react';
import {
  Row, Col,
  Button
} from 'reactstrap';
import {
  withRouter
} from 'react-router-dom';

import Bitmaps from '../../theme/Bitmaps';

import Menu from '../../components/Menu';

import Api from '../../apis/app';

class Contests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      starting: [],
      running: [],
      participants: [],
      status: 'starting',
    }
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('auth'));
    
    const data = await Api.get('get-contests', {member_id: user.user.member_info.id});
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          starting: body.starting,
          running: body.running,
          participants: body.participants
        });
        break;
      default:
        break;
    }
  }

  handleView(id) {
    this.props.history.push('/contests/view', id);
  }

  handleOverview(id) {
    this.props.history.push('/contests/overview', id);
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
      starting, running,
      participants,
      status
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

        <div className="dashboard container">
          <Row>
            <Col className="panel px-5" sm="12" md="6">
              <Button
                className={status == 'starting' ? 'active' : ''}
                outline
                color="info"
                onClick={() => 
                  this.setState({
                    status: 'starting'
                  })
                }
              >
                Contests Starting Soon
              </Button>
              <Button
                className={status == 'running' ? 'active' : ''}
                outline
                color="info"
                onClick={() => 
                  this.setState({
                    status: 'running'
                  })
                }
              >
                Contests Running
              </Button>
            </Col>
          </Row>

          {
            status == 'starting' && starting.length > 0 && (
              <Row>
                {
                  starting.map((item, index) => (
                    <Col className="d-flex contest" sm="12" md="6" key={index}>
                      <div className="mx-3 my-2">
                        <img src={Bitmaps.contest} />
                      </div>
                      <div className="mx-3 my-2">
                        <span style={{fontSize:"20px"}}>{item.name}</span>
                        <hr className="my-1" />
                        <Row>
                          <Col sm="6" className="text-right">Major Category:</Col>
                          <Col sm="6">{item.major}</Col>
                        </Row>
                        <Row>
                          <Col sm="6" className="text-right">Sub Category:</Col>
                          <Col sm="6">{item.sub}</Col>
                        </Row>
                        <Row>
                          <Col sm="6" className="text-right">Start Date:</Col>
                          <Col sm="6">{item.start_date}</Col>
                        </Row>
                        <Row>
                          <Col className="text-center mt-2" sm="12">
                            {
                              participants.filter(obj => obj.contest_id == item.id).length > 0 ? (
                                <Button
                                  color="success"
                                  type="button"
                                  onClick={this.handleView.bind(this, item.id)}
                                >
                                  <i className="fa fa-users" /> View
                                </Button>
                              ) : (
                                <Button
                                  color="primary"
                                  type="button"
                                  onClick={this.handleView.bind(this, item.id)}
                                >
                                  <i className="fa fa-users" /> Join
                                </Button>
                              )
                            }
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  ))
                }
              </Row>
            )
          }

          {
            status == 'running' && running.length > 0 && (
              <Row>
                {
                  running.map((item, index) => (
                    <Col className="d-flex contest" sm="12" md="6" key={index}>
                      <div className="mx-3 my-2">
                        <img src={Bitmaps.contest} />
                      </div>
                      <div className="mx-3 my-2">
                        <span style={{fontSize:"20px"}}>{item.name}</span>
                        <hr className="my-1" />
                        <Row>
                          <Col sm="6" className="text-right">Major Category:</Col>
                          <Col sm="6">{item.major}</Col>
                        </Row>
                        <Row>
                          <Col sm="6" className="text-right">Sub Category:</Col>
                          <Col sm="6">{item.sub}</Col>
                        </Row>
                        <Row>
                          <Col className="text-center mt-2" sm="12">
                            <Button
                              color="success"
                              type="button"
                              onClick={this.handleOverview.bind(this, item.id)}
                            >
                              <i className="fa fa-users" /> Overview
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  ))
                }
              </Row>
            )
          }
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Contests);