/* eslint-disable jsx-a11y/alt-text */
import React, { Component, Fragment } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row, Col,
  Button,
  Form, FormGroup, FormFeedback,
  Input, Label,
  UncontrolledAlert,
  Alert
} from 'reactstrap';
import Select from 'react-select';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

import Api from '../../apis/app';
import Bitmaps from '../../theme/Bitmaps';
import { Genders, countries } from '../../configs/data';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreviewUrl: '',
      birthday: null,
      fileKey: 1,
      alertVisible: false,
      messageStatus: false,
      successMessage: '',
      failMessage: '',
    };

    this.fileRef = React.createRef();
    this.formikRef = React.createRef();
  }

  fileUpload(e) {
    e.preventDefault();
    const reader = new FileReader();
    
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(file);
  }

  async handleSubmit(values, bags) {
    if (!this.state.birthday) {
      bags.setSubmitting(false);
      return;
    }

    let newData = {};
    const { imagePreviewUrl } = this.state;
    
    newData = {
      profile_image: imagePreviewUrl || '',
      join_date: values.join_date,
      firstname: values.firstname,
      lastname: values.lastname,
      gender: values.gender.id,
      birthday: this.state.birthday,
      email: values.email,
      number: values.number,
      country: values.country.code,
      state: values.state,
      county: values.county,
      city: values.city,
      zip_code: values.zip_code,
      street: values.street,
      building: values.building,
      apartment: values.apartment
    };

    const data = await Api.post('reg-member', newData);
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

  onChangeBirth(event, data) {
    if (data.value) {
      let birthday = this.convertDate(data.value);

      this.setState({
        birthday
      });
    } else {
      this.setState({
        birthday: null
      });
    }
  }

  convertDate(d) {
    let year = d.getFullYear();

    let month = d.getMonth() + 1;
    if (month < 10)
      month = '0' + month;

    let day = d.getDate();
    if (day < 10)
      day = '0' + day;

    return (year + '-' + month + '-' + day);
  }

  render() {
    const {
      imagePreviewUrl,
      birthday
    } = this.state;

    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

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
                profile_image: null,
                join_date: [year, month, day].join('-'),
                firstname: '',
                lastname: '',
                gender: null,
                birthday: null,
                email: '',
                number: '',
                country: '',
                state: '',
                county: '',
                city: '',
                zip_code: '',
                street: '',
                building: '',
                apartment: ''
              }}

              validationSchema={
                Yup.object().shape({
                  firstname: Yup.string().required('This field is required!'),
                  lastname: Yup.string().required('This field is required!'),
                  gender: Yup.mixed().required('This field is required!'),
                  email: Yup.string().email('Email is not valid!').required('This field is required!'),
                  number: Yup.string().matches(/^\+?[0-9]\s?[-]\s|[0-9]$/, 'Text Number is incorrect!')
                                      .required('This field is required!'),
                  country: Yup.mixed().required('This field is required!'),
                  state: Yup.string().required('This field is required!'),
                  county: Yup.mixed().required('This field is required!'),
                  city: Yup.string().required('This field is required!'),
                  zip_code: Yup.string().required('This field is required!'),
                  street: Yup.string().required('This field is required!'),
                  building: Yup.number().required('This field is required!').typeError('Building Number must be number type.'),
                  apartment: Yup.number().required('This field is required!').typeError('Apartment Number must be number type.')
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
                <Form onSubmit={handleSubmit}>
                  {status && <UncontrolledAlert {...status} />}
                  <Row>
                    <Col xs="12" sm="6">
                      <FormGroup className="reg-member">
                        <Label for="profile_image">Profile Image</Label>
                        <Input
                          ref="file"
                          type="file"
                          key={this.state.fileKey}
                          multiple={false}
                          onChange={this.fileUpload.bind(this)}
                        />
                        <div className={imagePreviewUrl ? 'image-preview is_image' : 'image-preview'}>
                          {$imagePreview}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="6">
                      <Row>
                        <Col sm="12">
                          <FormGroup>
                            <Label for="join_date">Join Date</Label>
                            <Input
                              id="join_date"
                              name="join_date"
                              type="text"
                              value={[year, month, day].join('-')}
                              readOnly
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="12">
                          <FormGroup>
                            <Label for="firstname">
                              First Name
                            </Label>
                            <Input
                              name="firstname"
                              type="text"
                              value={values.firstname || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={!!errors.firstname && touched.firstname}
                            />
                            <FormFeedback>{errors.firstname}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col sm="12">
                          <FormGroup>
                            <Label for="lastname">
                              Last Name
                            </Label>
                            <Input
                              name="lastname"
                              type="text"
                              value={values.lastname || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={!!errors.lastname && touched.lastname}
                            />
                            <FormFeedback>{errors.lastname}</FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="gender">Gender</Label>
                        <Select
                          name="gender"
                          classNamePrefix={!!errors.gender && touched.gender ? 'invalid react-select-lg' : 'react-select-lg'}
                          indicatorSeparator={null}
                          options={Genders}
                          getOptionValue={option => option.id}
                          getOptionLabel={option => option.name}
                          value={values.gender}
                          onChange={(value) => {
                            setFieldValue('gender', value);
                          }}
                          onBlur={this.handleBlur}
                        />
                        {!!errors.gender && touched.gender && (
                          <FormFeedback className="d-block">{errors.gender}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup className={!birthday && touched.birthday ? 'invalid calendar' : 'calendar'}>
                        <Label for="birthday">Birthday</Label>
                        <SemanticDatepicker
                          name="birthday"
                          placeholder="Birthday"
                          onChange={this.onChangeBirth.bind(this)}
                        />
                        {!birthday && touched.birthday && (
                          <FormFeedback className="d-block">This field is required!</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                          name="email"
                          type="email"
                          value={values.email || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.email && touched.email}
                        />
                        <FormFeedback>{errors.email}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="number">Text Number</Label>
                        <Input
                          name="number"
                          type="text"
                          value={values.number || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.number && touched.number}
                        />
                        <FormFeedback>{errors.number}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="country">Country</Label>
                        <Select
                          name="country"
                          classNamePrefix={!!errors.country && touched.country ? 'invalid react-select-lg' : 'react-select-lg'}
                          indicatorSeparator={null}
                          options={countries}
                          getOptionValue={option => option.code}
                          getOptionLabel={option => option.name}
                          value={values.country}
                          onChange={(value) => {
                            setFieldValue('country', value);
                          }}
                          onBlur={this.handleBlur}
                        />
                        {!!errors.country && touched.country && (
                          <FormFeedback className="d-block">{errors.country}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="state">State</Label>
                        <Input
                          name="state"
                          type="text"
                          value={values.state || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.state && touched.state}
                        />
                        <FormFeedback>{errors.state}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="county">County</Label>
                        <Input
                          name="county"
                          type="text"
                          value={values.county || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.county && touched.county}
                        />
                        <FormFeedback>{errors.county}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="city">City</Label>
                        <Input
                          name="city"
                          type="text"
                          value={values.city || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.city && touched.city}
                        />
                        <FormFeedback>{errors.city}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="zip_code">Zip Code</Label>
                        <Input
                          name="zip_code"
                          type="text"
                          value={values.zip_code || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.zip_code && touched.zip_code}
                        />
                        <FormFeedback>{errors.zip_code}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="street">Street Name</Label>
                        <Input
                          name="street"
                          type="text"
                          value={values.street || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.street && touched.street}
                        />
                        <FormFeedback>{errors.street}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="building">Building Number</Label>
                        <Input
                          name="building"
                          type="text"
                          value={values.building || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.building && touched.building}
                        />
                        <FormFeedback>{errors.building}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="6" xs="12">
                      <FormGroup>
                        <Label for="apartment">Apartment Number</Label>
                        <Input
                          name="apartment"
                          type="text"
                          value={values.apartment || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.apartment && touched.apartment}
                        />
                        <FormFeedback>{errors.apartment}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="w-100 d-flex justify-content-end">
                    <div>
                      <Button
                        className="mr-5"
                        disabled={isSubmitting}
                        type="submit"
                        color="primary"
                      >
                        Register
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        onClick={() => this.props.history.push('/')}
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