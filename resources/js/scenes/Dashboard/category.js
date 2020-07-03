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
import { List } from 'semantic-ui-react';

import Bitmaps from '../../theme/Bitmaps';

import Menu from '../../components/Menu';

import Api from '../../apis/app';

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

  handleAccount() {
    this.props.history.push('/account');
  }

  handleSignout() {
    localStorage.removeItem('auth');

    this.props.history.push('/signin');
  }

  render() {
    const { 
      option,
      catError, nameError,
      major, sub, 
      parent, cat_parent, cat_name,
      isOpen
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
                        option: 'major',
                        catError: false,
                        nameError: false
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
                        option: 'sub',
                        cat_name: '',
                        catError: false,
                        nameError: false
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
                        classNamePrefix={catError ? 'invalid react-select-lg' : 'react-select-lg'}
                        options={parent}
                        getOptionValue={option => option.value}
                        getOptionLabel={option => option.name}
                        value={cat_parent}
                        onChange={(option) => {
                          this.setState({
                            cat_parent: option,
                            catError: false
                          });
                        }}
                      />
                      {
                        catError && <FormFeedback className="d-block">Major Category is required!</FormFeedback>
                      }
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
                    className={nameError ? 'is-invalid' : ''}
                    type="text"
                    sm="8"
                    placeholder="Category Name"
                    value={cat_name}
                    onChange={(name) => {
                      this.setState({
                        cat_name: name.target.value,
                        nameError: false
                      });
                    }}
                  />
                  {
                    nameError && <FormFeedback>Category Name is required!</FormFeedback>
                  }
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
                                              {subitem.name}
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