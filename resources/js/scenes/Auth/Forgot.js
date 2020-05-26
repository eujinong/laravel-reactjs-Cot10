/* eslint-disable no-unused-vars */
import React, {
  Component, Fragment
} from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Link, withRouter
} from 'react-router-dom';
import {
  Form, FormGroup, Input, Button, Alert
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../layouts/Auth';
import Api from '../../apis/app';
import AppHelper from '../../helpers/AppHelper';


class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestSent: false
    };
  }

  async handleSubmit(values, bags) {
    const data = await Api.post('forgot', values);
    const { response, body } = data;
    switch (response.status) {
      case 422:
        await bags.setErrors(body.data);
        break;
      case 406:
        await bags.setStatus(AppHelper.getStatusAlertData(body));
        break;
      case 200:
        await this.setState({
          requestSent: true
        });
        break;
      default:
        break;
    }
    await bags.setSubmitting(false);
  }

  render() {
    const {
      requestSent
    } = this.state;
    return (
      <Layout
        form={(
          requestSent === false ? (
            <Formik
              initialValues={{
                email: '',
                confirm_email: ''
              }}
              validationSchema={
                Yup.object().shape({
                  email: Yup.string().email('Email is not valid!').required('Email is required!'),
                  confirm_email: Yup.string().email('Confirm Email is not valid!')
                    .oneOf([Yup.ref('email'), null], 'Confirm Email must match!')
                    .required('Confirm Email is required!')
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
                  {status && (<Alert {...status} />)}
                  <ul className="alert alert-danger">
                    {touched.email && !!errors.email && (
                      <li>
                        {touched.email && errors.email}
                      </li>
                    )}
                    {touched.confirm_email && !!errors.confirm_email && (
                      <li>
                        {touched.confirm_email && errors.confirm_email}
                      </li>
                    )}
                  </ul>
                  <div className="form-fields">
                    <FormGroup>
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
                      <i className="far fa-mail-bulk" />
                    </FormGroup>
                    <FormGroup>
                      <Input
                        type="email"
                        name="confirm_email"
                        id="confirm_email"
                        placeholder="Confirm Email"
                        value={values.confirm_email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.confirm_email && !!errors.confirm_email}
                      />
                      <i className="far fa-check-double" />
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
                        Request to reset
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
          ) : (
            <div className="intro-box-form-field text-center">
              <div className="success-message">
                <span className="text-success font-weight-bold">Success! </span>
                A confirmation link was sent to the email above for verification.
              </div>
              <div className="form-links">
                <FormGroup className="text-center">
                  <Button
                    type="submit"
                    color="success"
                    className="btn-lg"
                    onClick={() => this.props.history.push('/login')}
                  >
                    Back to login
                  </Button>
                </FormGroup>
              </div>
            </div>
          )
        )}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Forgot));
