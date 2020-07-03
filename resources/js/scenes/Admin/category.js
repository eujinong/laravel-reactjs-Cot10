import React, { Component, Fragment } from 'react';

import {
  withRouter
} from 'react-router-dom';

import {
  Row, Col, Collapse, Button
} from 'reactstrap';
import Select from 'react-select';
import { List } from 'semantic-ui-react';

import Api from '../../apis/app';

import TopBar from '../../components/TopBar';

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parent: [],
      major: [],
      sub: [],
      open: [],
      running: [],
      inactive: [],
      current: 0,
      request_id: '',
      request_cat: null,
      isOpen: []
    }
  }

  async componentDidMount() {
    const data = await Api.get('categories');
    const { response, body } = data;
    switch (response.status) {
      case 200:
        let parent = [];
        parent.push({
          name: 'No select',
          value: 0
        });

        let isOpen = [];

        for (let i in body.major) {
          if (body.major[i].active == 1) {
            let cat = {
              name: body.major[i].name,
              value: body.major[i].id
            }

            parent.push(cat);
          }

          isOpen.push(true);
        }

        let inactive = body.major.filter(item => item.active == 0);
        inactive = inactive.concat(body.sub.filter(item => item.active == 0));
      
        this.setState({
          major: body.major,
          sub: body.sub,
          open: body.open,
          running: body.running,
          parent,
          inactive,
          isOpen
        });

        if (inactive.length > 0) {
          this.setState({
            request_id: inactive[this.state.current].id
          });
        }
        break;
      default:
        break;
    }
  }

  async handleApproveCategory() {
    const { request_cat, request_id } = this.state;
    
    const params = [];

    params.parent_id = request_cat ? request_cat.value : 0;

    const data = await Api.put(`category/${request_id}`, params);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        let parent = [];
        parent.push({
          name: 'No select',
          value: 0
        });

        for (let i in body.major) {
          if (body.major[i].active == 1) {
            let cat = {
              name: body.major[i].name,
              value: body.major[i].id
            }

            parent.push(cat);
          }
        }

        let inactive = body.major.filter(item => item.active == 0);
        inactive = inactive.concat(body.sub.filter(item => item.active == 0));

        this.setState({
          major: body.major,
          sub: body.sub,
          open: body.open,
          running: body.running,
          parent,
          inactive,
          current: 0,
          request_cat: null
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
        let parent = [];
        parent.push({
          name: 'No select',
          value: 0
        });

        for (let i in body.major) {
          if (body.major[i].active == 1) {
            let cat = {
              name: body.major[i].name,
              value: body.major[i].id
            }

            parent.push(cat);
          }
        }

        let inactive = body.major.filter(item => item.active == 0);
        inactive = inactive.concat(body.sub.filter(item => item.active == 0));

        this.setState({
          major: body.major,
          sub: body.sub,
          open: body.open,
          running: body.running,
          parent,
          inactive,
          current: 0,
          request_cat: null
        });
        break;
      default:
        break;
    }
  }

  render() {
    const {
      major, sub, open, running,
      inactive, request_cat, current,
      parent, isOpen
    } = this.state;

    return (
      <Fragment>
        <TopBar type="web" />
        
        <div className="dashboard container">
          <Row>
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
                                sub.filter(child => child.parent_id == item.id).length == 0 && (
                                  <a onClick={this.handleDeleteCategory.bind(this, item.id)}>
                                    <i className="fa fa-trash ml-3"></i>
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
                                              <h5>{subitem.name}</h5>
                                              (
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
                                              )
                                              <a onClick={this.handleDeleteCategory.bind(this, subitem.id)}>
                                                <i className="fa fa-trash ml-3 text-danger"></i>
                                              </a>
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
            <Col sm="6">
              {
                inactive.length > 0 && (
                  <Fragment>
                    <h3 className="text-center">Category Requests for Approval</h3>
                    {
                      inactive.map((item, index) => (
                        <div className={index == current ? "requests active" : "requests"} key={index}>
                          {
                            item.parent_id == 0 ? (
                              <h4 className="my-4">Major Category</h4>
                            ) : (
                              <h4 className="my-4">Sub Category</h4>
                            )
                          }
                          <h5>Suggestion {index + 1}</h5>
                          <h5 className="mb-3">Category Name: {item.name}</h5>
                        </div>
                      ))
                    }
                    <Select
                      classNamePrefix="react-select-lg"
                      options={parent}
                      getOptionValue={option => option.value}
                      getOptionLabel={option => option.name}
                      value={request_cat}
                      onChange={(option) => {
                        this.setState({
                          request_cat: option
                        });
                      }}
                    />
                    <div className="d-flex text-center mt-3">
                      <Col sm="4" className="pt-2">
                        <a
                          className="prev"
                          onClick={() => {
                            let val = current > 0 ? current - 1 : 0;

                            this.setState({
                              current: val,
                              request_id: inactive[val].id
                            })
                          }}
                        >
                          Prev
                        </a>
                      </Col>
                      <Col sm="4" className="pt-2">
                        <a
                          className="next"
                          onClick={() => {
                            let val = current < inactive.length - 1 ? current + 1 : inactive.length - 1;

                            this.setState({
                              current: val,
                              request_id: inactive[val].id
                            })
                          }}
                        >
                          Next
                        </a>
                      </Col>
                      <Col sm="4">
                        <Button
                          className="btn-success"
                          type="button"
                          onClick={this.handleApproveCategory.bind(this)}
                        >
                          Save
                        </Button>
                      </Col>
                    </div>
                  </Fragment>
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