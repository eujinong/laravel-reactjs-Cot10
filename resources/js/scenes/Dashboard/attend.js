/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {
  Component, Fragment
} from 'react';
import { Formik } from 'formik';
import {
  Row, Col,
  Form, FormGroup,
  CustomInput, Input, Label, Button,
  Alert
} from 'reactstrap';
import {
  withRouter
} from 'react-router-dom';

import Bitmaps from '../../theme/Bitmaps';

import Menu from '../../components/Menu';

import Api from '../../apis/app';

class Attend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      member_id: '',
      contest_id: '',
      major: '',
      sub: '',
      name: '',
      title: '',
      files: [null, null, null, null, null, null, null, null, null, null],
      uploads: [null, null, null, null, null, null, null, null, null, null],
      urls: [null, null, null, null, null, null, null, null, null, null]
    };

    this.formikRef = React.createRef();
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('auth'));
    const contest_id = this.props.location.state;

    if (contest_id === undefined) {
      this.props.history.push('/contests');
    } else {
      this.setState({
        member_id: user.user.member_info.id,
        contest_id
      });

      const data = await Api.get(`get-contest/${contest_id}`);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          this.setState({
            major: body.major,
            sub: body.sub,
            name: body.name
          });
          break;
        default:
          break;
      }
    }
  }

  async handleSubmit(values, bags) {
    const {
      member_id,
      contest_id,
      title,
      files,
      uploads,
      urls
    } = this.state;

    let fNull = 0;
    let uNull = 0;
    for (let i = 0; i < 10; i++) {
      if (files[i] === null) {
        fNull++;
      }

      if (urls[i] === null) {
        uNull++;
      }
    }
    
    if (fNull == 10 && uNull == 10) {
      bags.setStatus({
        color: 'danger',
        children: 'You have to upload at least 1 media to demonstrate your idea.'
      });

      bags.setErrors('error');

      bags.setSubmitting(false);
      return;
    }
    
    let newData = {};

    newData = {
      member_id,
      contest_id,
      title,
      files,
      uploads,
      urls
    };

    const data = await Api.post('reg-participant', newData);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.props.history.push('/contests');
        break;
      case 422:
        if (body.message) {
          bags.setStatus({
            color: 'danger',
            children: body.message
          });
        }
        bags.setErrors(body.status);
        break;
      default:
        break;
    }

    bags.setSubmitting(false);
  }

  fileUpload(e, index) {
    e.preventDefault();
    
    const reader = new FileReader();

    let { uploads } = this.state;

    let file = e.target.files[0];

    reader.onloadend = () => {
      uploads[index] = reader.result;

      this.setState({
        uploads
      });
    };

    reader.readAsDataURL(file);
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
      major,
      sub,
      name,
      files,
      urls
    } = this.state;

    const media = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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
          <Alert color="info">
            <h3>
              <span className="mr-3">Major: {major},</span>
              <span className="mr-5">Sub: {sub}</span>
              <span>Title: "{name}"</span>
            </h3>
          </Alert>

          <Formik
            ref={this.formikRef}

            onSubmit={this.handleSubmit.bind(this)}

            render = {({
              status,
              handleSubmit,
              isSubmitting
            }) => (
              <Form onSubmit={handleSubmit}>
                {status && <UncontrolledAlert {...status} />}
                <Row>
                  <Col sm="12">
                    <FormGroup>
                      <Label>Title</Label>
                      <Input
                        type="text"
                        name="title"
                        onChange={value => {
                          this.setState({
                            title: value.currentTarget.value
                          });
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                {
                  media.map(index => (
                    <Row key={index}>
                      <Col sm="6">
                        <FormGroup>
                          <Label>File {index + 1}</Label>
                          <CustomInput
                            type="file"
                            id={"file" + (index + 1)}
                            name={"file" + (index + 1)}
                            label={files[index]}
                            disabled={files[index] == '' ? true : false}
                            onChange={(file) => {
                              files[index] = file.target.value.replace(/C:\\fakepath\\/, '');

                              if (files[index] == '') {
                                files[index] = null;
                                urls[index] = null;
                              } else {
                                urls[index] = '';
                              }

                              this.setState({
                                files,
                                urls
                              });

                              this.fileUpload.bind(this)(file, index);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label>URL {index + 1}</Label>
                          <Input
                            type="text"
                            placeholder={"URL " + (index + 1)}
                            value={urls[index] == null ? '' : urls[index]}
                            disabled={urls[index] == '' ? true : false}
                            onChange={(url) => {
                              urls[index] = url.target.value;

                              if (urls[index] == '') {
                                files[index] = null;
                                urls[index] = null;
                              } else {
                                files[index] = '';
                              }

                              this.setState({
                                files,
                                urls
                              });
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  ))
                }
                <div className="w-100 d-flex justify-content-end mb-5">
                  <Button
                    className="mr-5"
                    disabled={isSubmitting}
                    type="submit"
                    color="primary"
                  >
                    Accept Contest
                  </Button>
                </div>
              </Form>
            )}
          />
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Attend);