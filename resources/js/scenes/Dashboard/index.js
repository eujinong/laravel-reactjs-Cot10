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
  Container, Row, Col,
  Button
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
      majorCat: [],
      subCat: [],
      major: [],
      sub: []
    }
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('auth'));
    
    const interests = await Api.get('get-interests', {member_id: user.user.member_info.id});
    switch (interests.response.status) {
      case 200:
        this.setState({
          major: interests.body.major,
          sub: interests.body.sub
        });
        break;
      default:
        break;
    }

    const categories = await Api.get('categories');
    switch (categories.response.status) {
      case 200:
        this.setState({
          majorCat: categories.body.major.filter(item => {
            return interests.body.major.findIndex(it => it.id == item.id) == -1
          }),
          subCat: categories.body.sub.filter(item => {
            return interests.body.sub.findIndex(it => it.id == item.id) == -1
          })
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

  async handleAddInterest(id) {
    const { majorCat, subCat } = this.state;

    const user = JSON.parse(localStorage.getItem('auth'));

    const params = {
      category_id: id,
      member_id: user.user.member_info.id
    };

    const data = await Api.post('add-interest', params);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          majorCat: majorCat.filter(item => {
            return body.major.findIndex(it => it.id == item.id) == -1
          }),
          subCat: subCat.filter(item => {
            return body.sub.findIndex(it => it.id == item.id) == -1
          }),
          major: body.major,
          sub: body.sub
        });
        break;
      default:
        break;
    }
  }

  render() {
    const { 
      majorCat, subCat,
      major, sub
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
            <i className="fa fa-user"></i> Sign Out
          </a>
        </div>

        <Menu type="member" />

        <div className="dashboard">
          <Container>
            <Row>
              <Col sm="6">
                {
                  majorCat && majorCat.length > 0 && (
                    <List>
                      {
                        majorCat.map((item, index) => (
                          <List.Item key={index}>
                            <List.Icon className={item.active == 1 ? 'pt-1' : 'text-danger pt-1'} name="minus" />
                            <List.Content>
                              <List.Header className={item.active == 1 ? '' : 'text-danger'}>
                                {item.name}
                                {
                                  item.active == 1 && (
                                    <Button
                                      className="ml-2"
                                      color="info"
                                      size="sm"
                                      type="button"
                                      onClick={this.handleAddInterest.bind(this, item.id)}
                                    >
                                      Add to my Interests
                                    </Button>
                                  )
                                }
                              </List.Header>
                              {
                                subCat.filter(child => child.parent_id == item.id).length > 0 && (
                                  <List.List>
                                    {
                                      subCat.filter(child => child.parent_id == item.id).map((subitem, key) => (
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
              <Col sm="6">
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