import React, { Component, Fragment } from 'react';

import {
  withRouter
} from 'react-router-dom';

import {
  Row, Col,
  FormGroup, Alert,
  Label, Input, Button
} from 'reactstrap';
import Select from 'react-select';
import { List } from 'semantic-ui-react'

import Api from '../../apis/app';

import TopBar from '../../components/TopBar';
import Menu from '../../components/Menu';

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parent: [],
      major: [],
      sub: [],
      inactive: [],
      current: 0,
      request_id: '',
      cat_parent: null,
      request_cat: null,
      cat_name: ''
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

        for (let i in body.major) {
          if (body.major[i].active) {
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
          parent,
          inactive
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

  async handleAddCategory() {
    const { cat_parent, cat_name } = this.state;
    
    if (cat_name != '') {
      const params = [];

      params.parent_id = cat_parent ? cat_parent.value : 0;
      params.name = cat_name;

      const data = await Api.post('create-category', params);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          let parent = [];
          parent.push({
            name: 'No select',
            value: 0
          });

          for (let i in body.major) {
            if (body.major[i].active) {
              let cat = {
                name: body.major[i].name,
                value: body.major[i].id
              }
  
              parent.push(cat);
            }
          }

          let inactive = body.major.filter(item => item.active == 0);
          inactive = inactive.concat(body.sub.filter(item => item.active == 0));

          if (inactive.length > 0) {
            this.setState({
              request_id: inactive[this.state.current].id
            });
          }

          this.setState({
            alertVisible: true,
            messageStatus: true,
            message: body.message,
            major: body.major,
            sub: body.sub,
            parent,
            inactive,
            current: 0,
            request_cat: null,
            cat_parent: null,
            cat_name: ''
          });

          setTimeout(() => {
            this.setState({ alertVisible: false });
          }, 2000);
          break;
        case 422:
          this.setState({
            alertVisible: true,
            messageStatus: false,
            message: body.data
          });

          setTimeout(() => {
            this.setState({ alertVisible: false });
          }, 2000);
          break;
        default:
          break;
      }
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
          if (body.major[i].active) {
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
          if (body.major[i].active) {
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
      major, sub,
      inactive, request_cat, current,
      parent, cat_parent, cat_name
    } = this.state;

    return (
      <Fragment>
        <TopBar type="contest" />

        <Menu type="contest" />
        
        <div className="dashboard container">
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              {
                this.state.alertVisible && (
                  <div className="w-100 mb-5">
                    <Alert color={this.state.messageStatus ? 'success' : 'warning'} isOpen={this.state.alertVisible}>
                      {this.state.message}
                    </Alert>
                  </div>
                )
              }

              <FormGroup row>
                <Label for="parent" sm="4" className="text-right">Major Categories:</Label>
                <Col sm="8">
                  <Select
                    classNamePrefix="react-select-lg"
                    options={parent}
                    getOptionValue={option => option.value}
                    getOptionLabel={option => option.name}
                    value={cat_parent}
                    onChange={(option) => {
                      this.setState({
                        cat_parent: option
                      });
                    }}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="name" sm="4" className="text-right">Category Name:</Label>
                <Col sm="8">
                  <Input
                    type="text"
                    sm="8"
                    placeholder="Category Name"
                    value={cat_name}
                    onChange={(name) => {
                      this.setState({
                        cat_name: name.target.value
                      });
                    }}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="text-center">
                <Button
                  color="success"
                  type="button"
                  onClick={this.handleAddCategory.bind(this)}
                >
                  <i className="fa fa-plus-circle" /> New Category
                </Button>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              {
                major && major.length > 0 && (
                  <List>
                    {
                      major.map((item, index) => (
                        <List.Item key={index}>
                          <List.Icon className={item.active == 1 ? '' : 'text-danger'} name="minus" />
                          <List.Content>
                            <List.Header className={item.active == 1 ? '' : 'text-danger'}>
                              {item.name}
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
                                <List.List>
                                  {
                                    sub.filter(child => child.parent_id == item.id).map((subitem, key) => (
                                      <List.Item key={key}>
                                        <List.Icon className={subitem.active == 1 ? '' : 'text-danger'} name="minus" />
                                        <List.Content>
                                          <List.Header className={subitem.active == 1 ? '' : 'text-danger'}>
                                            {subitem.name}
                                            <a onClick={this.handleDeleteCategory.bind(this, subitem.id)}>
                                              <i className="fa fa-trash ml-3"></i>
                                            </a>
                                          </List.Header>
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