/* eslint-disable jsx-a11y/alt-text */
import React, { Component, Fragment } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Col,
  Button,
  Form, FormGroup, FormFeedback,
  Input, Label,
  UncontrolledAlert,
  Alert
} from 'reactstrap';

import Api from '../../apis/app';
import Bitmaps from '../../theme/Bitmaps';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertVisible: false,
      messageStatus: false,
      successMessage: '',
      failMessage: '',
    };

    this.formikRef = React.createRef();
  }

  async handleSubmit(values, bags) {
    let newData = {};
    
    newData = {
      username: values.username,
      password: values.password,
      email: values.email
    };

    const data = await Api.post('reg-user', newData);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          alertVisible: true,
          messageStatus: true,
          successMessage: 'Added Successfully!'
        });

        setTimeout(() => {
          this.setState({ alertVisible: false });
          this.props.history.goBack();
        }, 2000);
        break;
      case 406:
        if (body.message) {
          bags.setStatus({
            color: 'danger',
            children: body.message
          });
        }
        break;
      case 422:
        this.setState({
          alertVisible: true,
          messageStatus: false,
          failMessage: body.data && 
            (`${body.data.email !== undefined ? body.data.email : ''}`)
        });
        break;
      default:
        break;
    }

    bags.setSubmitting(false);
  }

  render() {

    return (
      <Fragment>
        <div className="top-header tile-top-bar">
          <a href="/">
            <img src={Bitmaps.logo} alt="Cot10" />
          </a>
        </div>

        <div className="dashboard">
          <Container>
            <div className="w-100 mb-5">
              <Alert color={this.state.messageStatus ? 'success' : 'warning'} isOpen={this.state.alertVisible}>
                {
                  this.state.messageStatus ? this.state.successMessage : this.state.failMessage
                }
              </Alert>
            </div>

            <Formik
              ref={this.formikRef}

              initialValues={{
                username: '',
                email: '',
                password: '',
                confirm: ''
              }}

              validationSchema={
                Yup.object().shape({
                  username: Yup.string().required('Username is required!'),
                  email: Yup.string().email('Email is not valid!').required('Email is required!'),
                  password: Yup.string().min(6, 'Password has to be longer than 6 characters!').required('Password is required!'),
                  confirm: Yup.string().required('Confirm Password is required!').when("password", {
                    is: val => (val && val.length > 0 ? true : false),
                    then: Yup.string().oneOf(
                      [Yup.ref("password")],
                      "Confirm Password need to be same with Password"
                    )
                  })
                })
              }

              onSubmit={this.handleSubmit.bind(this)}

              render={({
                values,
                errors,
                status,
                touched,
                setFieldValue,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting
              }) => (
                <Form className="intro-box-form-field" onSubmit={handleSubmit}>
                  {status && <UncontrolledAlert {...status} />}
                  <div className="form-fields">
                    <FormGroup row>
                      <Label for="username" sm="2" className="text-right">Username:</Label>
                      <Col sm="10">
                        <Input
                          name="username"
                          type="text"
                          value={values.username || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.username && touched.username}
                        />
                        <FormFeedback>{errors.username}</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="email" sm="2" className="text-right">Email:</Label>
                      <Col sm="10">
                        <Input
                          name="email"
                          type="email"
                          value={values.email || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.email && touched.email}
                        />
                        <FormFeedback>{errors.email}</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="password" sm="2" className="text-right">Password:</Label>
                      <Col sm="10">
                        <Input
                          type="password"
                          name="password"
                          id="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.password && !!errors.password}
                        />
                        <FormFeedback>{errors.password}</FormFeedback>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="confirm" sm="2" className="text-right">Confirm Password:</Label>
                      <Col sm="10">
                        <Input
                          type="password"
                          name="confirm"
                          id="confirm"
                          value={values.confirm}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.confirm && !!errors.confirm}
                        />
                        <FormFeedback>{errors.confirm}</FormFeedback>
                      </Col>
                    </FormGroup>
                  </div>
                  <div className="w-100 d-flex justify-content-end">
                    <div>
                      <Button
                        className="mr-5"
                        disabled={isSubmitting}
                        type="submit"
                        color="primary"
                      >
                        Signup
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => this.props.history.push('/contest/signin')}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            />
          </Container>
        </div>        
      </Fragment>
    );
  }
}

export default Signup;