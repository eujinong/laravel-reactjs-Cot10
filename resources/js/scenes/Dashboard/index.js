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
import { List } from 'semantic-ui-react';

import { logout } from '../../actions/common';

import Api from '../../apis/app';

import Bitmaps from '../../theme/Bitmaps';
import Menu from '../../components/Menu';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      major: [],
      sub: []
    }
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('auth'));
    
    const data = await Api.get('get-interests', {member_id: user.user.member_info.id});
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          major: body.major,
          sub: body.sub
        });
        break;
      default:
        break;
    }
  }

  async handleSignout() {
    await this.props.logout();

    this.props.history.push('/signin');
  }

  render() {
    const { major, sub } = this.state;
    
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
            <i className="fa fa-user"></i> Sign Out
          </a>
        </div>

        <Menu type="member" />

        <div className="dashboard">
          <Container>
            <Row>
              <Col sm="12">
                {
                  major && major.length > 0 && (
                    <List>
                      {
                        major.map((item, index) => (
                          <List.Item key={index}>
                            <List.Icon className={item.active == 1 ? '' : 'text-danger'} name="minus" />
                            <List.Content>
                              <List.Header className={item.active == 1 ? '' : 'text-danger'}>{item.name}</List.Header>
                              {
                                sub.filter(child => child.parent_id == item.id).length > 0 && (
                                  <List.List>
                                    {
                                      sub.filter(child => child.parent_id == item.id).map((subitem, key) => (
                                        <List.Item key={key}>
                                          <List.Icon className={subitem.active == 1 ? '' : 'text-danger'} name="minus" />
                                          <List.Content>
                                            <List.Header className={subitem.active == 1 ? '' : 'text-danger'}>{subitem.name}</List.Header>
                                          </List.Content>
                                        </List.Item>
                                      ))
                                    }
                                  </List.List>
                                )
                              }
                            </List.Content>
                          </List.Item>
                        ))
                      }
                    </List>
                  )
                }
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