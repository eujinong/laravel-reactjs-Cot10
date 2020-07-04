import React, { Component, Fragment } from 'react';

import {
  withRouter
} from 'react-router-dom';

import {
  Row, Col, Collapse
} from 'reactstrap';
import { List } from 'semantic-ui-react';

import Api from '../../apis/app';

import TopBar from '../../components/TopBar';

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      major: [],
      sub: [],
      open: [],
      running: [],
      request_id: '',
      isOpen: []
    }
  }

  async componentDidMount() {
    const data = await Api.get('categories');
    const { response, body } = data;
    switch (response.status) {
      case 200:
        let isOpen = [];

        for (let i in body.major) {
          isOpen.push(true);
        }

        this.setState({
          major: body.major,
          sub: body.sub,
          open: body.open,
          running: body.running,
          isOpen
        });
        break;
      default:
        break;
    }
  }

  async handleApproveCategory(id) {
    const data = await Api.put(`category/${id}`);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        let isOpen = [];

        for (let i in body.major) {
          isOpen.push(true);
        }

        this.setState({
          major: body.major,
          sub: body.sub,
          open: body.open,
          running: body.running,
          isOpen
        });
        break;
      default:
        break;
    }
  }

  async handleDeleteCategory(id) {
    const data = await Api.delete(`category/${id}`);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        let isOpen = [];
        
        for (let i in body.major) {
          isOpen.push(true);
        }

        this.setState({
          major: body.major,
          sub: body.sub,
          open: body.open,
          running: body.running,
          isOpen
        });
        break;
      default:
        break;
    }
  }

  render() {
    const {
      major, sub, open, running,
      isOpen
    } = this.state;

    return (
      <Fragment>
        <TopBar type="web" />
        
        <div className="dashboard container">
          <Row>
            <Col sm="3"></Col>
            <Col sm="6">
              {
                major && major.length > 0 && (
                  <List className="cat">
                    {
                      major.map((item, index) => (
                        <List.Item key={index}>
                          <List.Icon
                            className={item.active == 1 ? '' : 'text-danger'}
                            name={isOpen[index] ? 'minus' : 'plus'}
                            onClick={() => {
                              let { isOpen } = this.state;

                              isOpen[index] = !isOpen[index];

                              this.setState({
                                isOpen
                              });
                            }}
                          />
                          <List.Content>
                            <List.Header className={item.active == 1 ? '' : 'text-danger'}>
                              <a
                                onClick={() => {
                                  let { isOpen } = this.state;

                                  isOpen[index] = !isOpen[index];

                                  this.setState({
                                    isOpen
                                  });
                                }}
                              >
                                {item.name}
                              </a>
                              {
                                item.active == 0 && (
                                  <a onClick={this.handleApproveCategory.bind(this, item.id)}>
                                    <i className="fa fa-save ml-3 text-primary"></i>
                                  </a>
                                )
                              }
                              {
                                sub.filter(child => child.parent_id == item.id).length == 0 && (
                                  <a onClick={this.handleDeleteCategory.bind(this, item.id)}>
                                    <i className="fa fa-trash ml-3 text-danger"></i>
                                  </a>
                                )
                              }
                            </List.Header>
                            {
                              sub.filter(child => child.parent_id == item.id).length > 0 && (
                                <Collapse isOpen={isOpen[index]}>
                                  <List.List>
                                    {
                                      sub.filter(child => child.parent_id == item.id).map((subitem, key) => (
                                        <List.Item key={key}>
                                          <List.Icon className={subitem.active == 1 ? '' : 'text-danger'} name="minus" />
                                          <List.Content>
                                            <List.Header className={subitem.active == 1 ? '' : 'text-danger'}>
                                              <span>{subitem.name}</span>
                                              {
                                                subitem.active == 0 && (
                                                  <a onClick={this.handleApproveCategory.bind(this, subitem.id)}>
                                                    <i className="fa fa-save ml-3 text-primary"></i>
                                                  </a>
                                                )
                                              }
                                              {
                                                open.filter(item => item.category_id == subitem.id).length == 0 &&
                                                running.filter(item => item.category_id == subitem.id).length == 0 && (
                                                  <a onClick={this.handleDeleteCategory.bind(this, subitem.id)}>
                                                    <i className="fa fa-trash ml-3 text-danger"></i>
                                                  </a>
                                                )
                                              }
                                              <br /><br />
                                              <span className="text-danger">
                                              {
                                                open.filter(item => item.category_id == subitem.id).length > 0 ? (                                                  
                                                  open.filter(item => item.category_id == subitem.id)[0].open
                                                ) : (
                                                  0
                                                )
                                              }
                                              </span>
                                              <span> Open Contests, </span>
                                              <span className="text-danger">
                                              {
                                                running.filter(item => item.category_id == subitem.id).length > 0 ? (                                                  
                                                  running.filter(item => item.category_id == subitem.id)[0].running
                                                ) : (
                                                  0
                                                )
                                              }
                                              </span>
                                              <span> Running Contests</span>
                                            </List.Header>
                                          </List.Content>
                                        </List.Item>
                                      ))
                                    }
                                  </List.List>
                                </Collapse>
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
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Category);