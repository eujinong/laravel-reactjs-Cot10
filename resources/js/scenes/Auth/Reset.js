import React, {
  Component, Fragment
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import {
  Form, FormGroup, Input, Button, Alert
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../layouts/Auth';

import Api from '../../apis/app';
import {
  login
} from '../../actions/common';
import AppHelper from '../../helpers/AppHelper';

class Reset extends Component {
  componentDidMount() {
    
  }

  async handleSubmit(values, bags) {
    const { token } = this.props.match.params;
    const data = await Api.post(`reset/${token}`, values);
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
    this.props.history.push('/');
  }

  render() {
    return (
      <Layout
        form={(
          <Formik
            initialValues={{
              password: '',
              password_confirmation: ''
            }}
            validationSchema={
              Yup.object().shape({
                password: Yup.string().min(6, 'Password has to be longer than 6 characters!').required('Password is required!'),
                password_confirmation: Yup.string()
                  .min(6, 'Password has to be longer than 6 characters!')
                  .oneOf([Yup.ref('password'), null], 'Confirm Password must match!')
                  .required('Confirm Password is required!')
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
                <ul className="alert alert-danger">
                  {touched.email && !!errors.email && (
                    <li>
                      {touched.email && errors.email}
                    </li>
                  )}
                  {touched.password && !!errors.password && (
                    <li>
                      {touched.password && errors.password}
                    </li>
                  )}
                </ul>
                <div className="form-fields">
                  <FormGroup>
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
                    <i className="fa fa-fingerprint" />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="password"
                      name="password_confirmation"
                      id="password_confirmation"
                      placeholder="Confirm Password"
                      value={values.password_confirmation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.password_confirmation && !!errors.password_confirmation}
                    />
                    <i className="fa fa-check-double" />
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
                      Reset password
                    </Button>
                  </FormGroup>
                  <FormGroup>
                    <div className="text-center">
                      <Link to="/login">Cancel</Link>
                    </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reset));
