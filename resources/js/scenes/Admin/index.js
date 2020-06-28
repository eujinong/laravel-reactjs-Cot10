/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, { Component, Fragment } from 'react';
import { Formik } from 'formik';
import {
  withRouter
} from 'react-router-dom';

import {
  Container,
  Row, Col,
  Button,
  Form, FormGroup, FormFeedback,
  UncontrolledAlert,
  Alert,
  Input, Label
} from 'reactstrap';

import Api from '../../apis/app';

import TopBar from '../../components/TopBar';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      alertVisible: false,
      messageStatus: false,
      successMessage: '',
      failMessage: ''
    }

    this.formikRef = React.createRef();
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

    this.settingValues();
  }

  settingValues() {
    const { options } = this.state;
    const { formikRef } = this;

    formikRef.current.setValues({
      'welcome': options.welcome,
      'guide': options.guide || ''
    });
  }

  async handleSubmit(values, bags) {
    let newData = {};

    newData = {
      welcome: values.welcome,
      guide: values.guide
    }

    const data = await Api.post('setConfig', newData);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          alertVisible: true,
          messageStatus: true,
          successMessage: 'Created Successfully!'
        });

        setTimeout(() => {
          this.setState({ alertVisible: false });
        }, 2000);
        break;
      default:
        break;
    }

    bags.setSubmitting(false);
  }

  render() {
    return (
      <Fragment>
        <TopBar type="web" />

        <div className="dashboard">
          <Container>
            <h1 className="text-center">Web Manager Configuration</h1>

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
                welcome: '',
                guide: ''
              }}

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
                <Form onSubmit={handleSubmit}>
                  {status && <UncontrolledAlert {...status} />}

                  <Row>
                    <Col sm="4" className="text-right">
                      <Label className="mt-2" for="welcome">Welcome Message:</Label>
                    </Col>
                    <Col sm="8">
                      <FormGroup>
                        <Input
                          name="welcome"
                          type="text"
                          value={values.welcome}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="4" className="text-right">
                      <Label className="mt-2" for="welcome">Guide:</Label>
                    </Col>
                    <Col sm="8">
                      <FormGroup>
                        <Input
                          name="guide"
                          type="text"
                          value={values.guide}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="w-100 text-center">
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      color="primary"
                    >
                      Save
                    </Button>
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

export default withRouter(Dashboard);