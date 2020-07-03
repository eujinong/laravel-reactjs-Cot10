import React, { Component, Fragment } from 'react';

import {
  withRouter
} from 'react-router-dom';

import {
  Row, Col,
  FormGroup, FormFeedback, Alert,
  CustomInput, Collapse,
  Label, Input, Button
} from 'reactstrap';
import Select from 'react-select';
import { List } from 'semantic-ui-react'

import Api from '../../apis/app';

import TopBar from '../../components/TopBar';

class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      option: 'major',
      catError: false,
      nameError: false,
      parent: [],
      major: [],
      sub: [],
      open: [],
      running: [],
      cat_parent: null,
      cat_name: '',
      isOpen: []
    }
  }

  async componentDidMount() {
    const data = await Api.get('categories');
    const { response, body } = data;
    switch (response.status) {
      case 200:
        let parent = [];
        let isOpen = [];
        
        for (let i in body.major) {
          if (body.major[i].active == 1) {
            let cat = {
              name: body.major[i].name,
              value: body.major[i].id
            }

            parent.push(cat);
          }

          isOpen.push(false);
        }

        this.setState({
          major: body.major,
          sub: body.sub,
          open: body.open,
          running: body.running,
          parent,
          isOpen
        });
        break;
      default:
        break;
    }
  }

  async handleAddCategory() {
    const { cat_parent, cat_name } = this.state;

    if (cat_parent === null) {
      this.setState({
        catError: true
      });
    }

    if (cat_name == '') {
      this.setState({
        nameError: true
      });
    }
    
    if (cat_name != '') {
      const params = [];

      params.parent_id = cat_parent ? cat_parent.value : 0;
      params.name = cat_name;
      params.active = 0;

      const data = await Api.post('create-category', params);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          let parent = [];
          let isOpen = [];

          for (let i in body.major) {
            if (body.major[i].active == 1) {
              let cat = {
                name: body.major[i].name,
                value: body.major[i].id
              }
  
              parent.push(cat);
            }

            isOpen.push(false);
          }

          this.setState({
            alertVisible: true,
            messageStatus: true,
            message: body.message,
            major: body.major,
            sub: body.sub,
            parent,
            cat_parent: null,
            cat_name: '',
            isOpen
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

  render() {
    const { 
      option,
      catError, nameError,
      major, sub, open, running,
      parent, cat_parent, cat_name,
      isOpen
    } = this.state;

    return (
      <Fragment>
        <TopBar type="contest" />
        
        <div className="dashboard container">
          <Row>
            <Col sm="6">
              {
                this.state.alertVisible && (
                  <div className="w-100 mb-5">
                    <Alert color={this.state.messageStatus ? 'success' : 'warning'} isOpen={this.state.alertVisible}>
                      {this.state.message}
                    </Alert>
                  </div>
                )
              }

              <FormGroup>
                <div>
                  <CustomInput
                    type="radio"
                    id="major"
                    name="catOption"
                    label="Major Category"
                    inline
                    defaultChecked
                    onClick={() => {
                      this.setState({
                        option: 'major'
                      });
                    }}
                  />
                  <CustomInput
                    type="radio"
                    id="sub"
                    name="catOption"
                    label="Sub Category"
                    inline
                    onClick={() => {
                      this.setState({
                        option: 'sub'
                      });
                    }}
                  />
                </div>
              </FormGroup>

              {
                option == 'sub' && (
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
                )
              }
              <FormGroup row>
                <Label for="name" sm="4" className="text-right">
                  {
                    option == 'major' && 'Major Category Name:'
                  }
                  {
                    option == 'sub' && 'Sub Category Name:'
                  }
                </Label>
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
            <Col sm="6">
              {
                major && major.length > 0 && (
                  <List>
                    {
                      major.map((item, index) => (
                        <List.Item key={index}>
                          <List.Icon
                            className={item.active == 1 ? '' : 'text-danger'}
                            name={isOpen[index] ? 'minus' : 'plus'}
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