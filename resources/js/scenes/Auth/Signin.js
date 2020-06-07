import React, {
  Component, Fragment
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  Col,
  Form, FormGroup, 
  Label, Input, Button, Alert
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../layouts/Auth';

import Api from '../../apis/app';
import {
  login
} from '../../actions/common';
import AppHelper from '../../helpers/AppHelper';

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: []
    }
  }

  async componentDidMount() {
    const data = await Api.get('getConfig');
    const { response, body } = data;
    switch (response.status) {
      case 200:
        let options = [];
        body.options.map(item => {
          options[item.option] = item.value;
        });

        this.setState({
          options
        });
        break;
      default:
        break;
    }
  }

  async handleSubmit(values, bags) {
    values.usertype = 'user';

    const data = await Api.post('signin', values);
    const { response, body } = data;
    switch (response.status) {
      case 422:
        bags.setErrors(body.data);
        break;
      case 406:
        bags.setStatus(AppHelper.getStatusAlertData(body));
        break;
      case 200:
        this.login(body.data);
        break;
      default:
        break;
    }
    bags.setSubmitting(false);
  }

  async login(auth) {
    await this.props.login(auth);

    this.props.history.push('/dashboard');
  }

  render() {
    const { options } = this.state;

    return (
      <Layout
        options={options}
        form={(
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email('Email is not valid!').required('Email is required!'),
                password: Yup.string().min(6, 'Password has to be longer than 6 characters!').required('Password is required!')
              })
            }
            onSubmit={this.handleSubmit.bind(this)}
            render={({
              values,
              errors,
              status,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting
            }) => (
              <Form className="intro-box-form-field" onSubmit={handleSubmit}>
                {status && <Alert {...status} />}
                <div className="form-fields">
                  <FormGroup row>
                    <Label for="email" sm="2" className="text-right">User Email:</Label>
                    <Col sm="10">
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.email && !!errors.email}
                      />
                      <ul className="alert alert-danger">
                        {touched.email && !!errors.email && (
                          <li>
                            {touched.email && errors.email}
                          </li>
                        )}
                      </ul>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="password" sm="2" className="text-right">Password:</Label>
                    <Col sm="10">
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.password && !!errors.password}
                      />
                      <ul className="alert alert-danger">
                        {touched.password && !!errors.password && (
                          <li>
                            {touched.password && errors.password}
                          </li>
                        )}
                      </ul>
                    </Col>
                  </FormGroup>
                </div>
                <div className="form-links">
                  <FormGroup className="text-center">
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      color="success"
                      className="btn-lg"
                    >
                      {
                        isSubmitting && (
                          <Fragment>
                            <span className="fa fa-spinner fa-spin" />
                            &nbsp;&nbsp;
                          </Fragment>
                        )
                      }
                      Sign In
                    </Button>
                    <a className="btn btn-primary ml-5" href="/signup">Signup</a>
                  </FormGroup>
                </div>
              </Form>
            )}
          />
        )}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin));
