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
  Alert, UncontrolledTooltip
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
      majorcat: [],
      imagePreviewUrl: '',
      fileKey: 1,
      alertVisible: false,
      messageStatus: false,
      successMessage: '',
      failMessage: '',
    };

    this.fileRef = React.createRef();
    this.formikRef = React.createRef();
  }

  async componentDidMount() {
    const categories = await Api.get('categories');
    switch (categories.response.status) {
      case 200:
        let majorcat = [];

        categories.body.major.map(item => {
          majorcat.push({value: item.id, label: item.name});
        });

        this.setState({
          majorcat
        });
        break;
      default:
        break;
    }
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
    let newData = {};
    const { imagePreviewUrl } = this.state;

    let major_ids = [];
    for (let i = 0; i < values.major.length; i++) {
      major_ids.push(values.major[i].value)
    }
    
    newData = {
      profile_image: imagePreviewUrl || '',
      firstname: values.firstname,
      lastname: values.lastname,
      gender: values.gender.id,
      email: values.email,
      number: values.number,
      country: values.country.code,
      state: values.state,
      county: values.county,
      city: values.city,
      zip_code: values.zip_code,
      street: values.street,
      building: values.building,
      apartment: values.apartment,
      major_ids
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

  render() {
    const {
      majorcat,
      imagePreviewUrl
    } = this.state;

    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

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
                firstname: '',
                lastname: '',
                gender: null,
                email: '',
                number: '',
                country: '',
                state: '',
                county: '',
                city: '',
                zip_code: '',
                street: '',
                building: '',
                apartment: '',
                major: null
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
                  apartment: Yup.number().required('This field is required!').typeError('Apartment Number must be number type.'),
                  major: Yup.string().typeError('Major Category must be selected at least 1.')
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
                <Form onSubmit={handleSubmit} className="reg-member">
                  {status && <UncontrolledAlert {...status} />}
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="profile_image">
                        Profile Image:
                        <span className="explain" id="profile_image">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="profile_image">
                        Profile Image
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="firstname" className="mt-2">
                        First Name:
                        <span className="explain" id="firstname">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="firstname">
                        First Name
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="lastname" className="mt-2">
                        Last Name:
                        <span className="explain" id="lastname">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="lastname">
                        Last Name
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="gender" className="mt-2">
                        Gender:
                        <span className="explain" id="gender">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="gender">
                        Gender
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="country" className="mt-2">
                        Country:
                        <span className="explain" id="country">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="country">
                        Country
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="state" className="mt-2">
                        State:
                        <span className="explain" id="state">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="state">
                        State
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="county" className="mt-2">
                        County:
                        <span className="explain" id="county">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="county">
                        County
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="city" className="mt-2">
                        City:
                        <span className="explain" id="city">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="city">
                        City
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="zip_code" className="mt-2">
                        Zip Code:
                        <span className="explain" id="zip_code">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="zip_code">
                        Zip Code
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="street" className="mt-2">
                        Street Name:
                        <span className="explain" id="street">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="street">
                        Street Name
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="building" className="mt-2">
                        House or Building Number:
                        <span className="explain" id="building">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="building">
                        House or Building Number
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="apartment" className="mt-2">
                        Apartment or Unit Number:
                        <span className="explain" id="apartment">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="apartment">
                        Apartment or Unit Number
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="email" className="mt-2">
                        Email:
                        <span className="explain" id="email">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="email">
                        Email
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="number" className="mt-2">
                        Text Number:
                        <span className="explain" id="number">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="number">
                        Text Number
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
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
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="major" className="mt-2">
                        Interested in Major Category:
                        <span className="explain" id="major">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="major">
                        Interested in Major Category
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
                        <Select
                          name="major"
                          isMulti
                          menuPlacement="auto"
                          classNamePrefix={!!errors.major && touched.major ? 'invalid react-select-lg' : 'react-select-lg'}
                          indicatorSeparator={null}
                          options={majorcat}
                          getOptionValue={option => option.value}
                          getOptionLabel={option => option.label}
                          value={values.major}
                          onChange={(option) => {
                            setFieldValue('major', option);
                          }}
                          onBlur={this.handleBlur}
                        />
                        {!!errors.major && touched.major && (
                          <FormFeedback className="d-block">{errors.major}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="w-100 d-flex justify-content-center my-3">
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