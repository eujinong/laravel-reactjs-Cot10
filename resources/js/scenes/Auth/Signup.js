/* eslint-disable jsx-a11y/alt-text */
import React, { Component, Fragment } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row, Col,
  Button,
  Modal, ModalBody, ModalFooter,
  Form, FormGroup, FormFeedback,
  Input, Label, CustomInput,
  UncontrolledAlert,
  Alert, UncontrolledTooltip
} from 'reactstrap';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

import Api from '../../apis/app';
import Bitmaps from '../../theme/Bitmaps';
import { countries, counties, cities } from '../../configs/data';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      majorcat: [],
      majorChecked: [],
      imagePreviewUrl: '',
      fileKey: 1,
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

        categories.body.major.filter(cat => cat.active == 1).map(item => {
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
    const { imagePreviewUrl, modal } = this.state;

    let newData = {
      profile_image: imagePreviewUrl || '',
      firstname: values.firstname,
      lastname: values.lastname,
      password: values.password,
      gender: values.gender,
      email: values.email,
      number: values.number,
      country: values.country.countryCode,
      state: values.state.value,
      county: values.county.code,
      city: values.city.code,
      zip_code: values.zip_code.code,
      street: values.street,
      building: values.building,
      apartment: values.apartment,
      major_ids: values.major || []
    };

    const data = await Api.post('reg-member', newData);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          modal: !modal,
          messageStatus: true,
          successMessage: 'Added Successfully!'
        });
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
          modal: !modal,
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

  handleToggle() {
    const { modal } = this.state;

    this.setState({
      modal: !modal
    });
  }

  handleLogin() {
    const { modal } = this.state;

    this.setState({
      modal: !modal
    });

    this.props.history.push('/signin');
  }

  render() {
    const {
      modal,
      majorcat,
      imagePreviewUrl
    } = this.state;

    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    let states = [
      { value: 'il', label: 'Illinois (IL)'},
      { value: 'in', label: 'Indiana (IN)'},
    ];

    let zip_codes = [];

    for (var i = 60001; i < 63000; i++) {
      zip_codes.push({ code: i, label: i, state: 'il' });
    }

    for (var i = 46001; i < 48000; i++) {
      zip_codes.push({ code: i, label: i, state: 'in' });
    }

    return (
      <Fragment>
        <div className="top-header tile-top-bar">
          <a href="/">
            <img src={Bitmaps.logo} alt="Cot10" />
          </a>
        </div>

        {
          this.state.messageStatus ? (
            <div>
              <Modal
                isOpen={modal}
                toggle={this.handleToggle.bind(this)}
              >
                <ModalBody>
                  <div className="w-100">
                    <Alert color='success' isOpen={true}>{this.state.successMessage}</Alert>
                  </div>
                  <h3>Would you like to login now?</h3>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="success"
                    onClick={this.handleLogin.bind(this)}
                  >
                    Login
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          ) : (
            <div>
              <Modal
                isOpen={modal}
                toggle={this.handleToggle.bind(this)}
              >
                <ModalBody>
                  <div className="w-100">
                    <Alert color='warning' isOpen={true}>{this.state.failMessage}</Alert>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="secondary"
                    onClick={this.handleToggle.bind(this)}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          )
        }
        
        <div className="dashboard">
          <Container>
            <Formik
              ref={this.formikRef}

              initialValues={{
                profile_image: null,
                firstname: '',
                lastname: '',
                password: '',
                confirm: '',
                gender: null,
                email: '',
                number: '',
                country: countries.filter(country => country.code == 'USA')[0],
                state: states.filter(state => state.value == 'il')[0],
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
                  password: Yup.string().min(6, 'Password has to be longer than 6 characters!').required('Password is required!'),
                  confirm: Yup.string().required('Confirm Password is required!').when("password", {
                    is: val => (val && val.length > 0 ? true : false),
                    then: Yup.string().oneOf(
                      [Yup.ref("password")],
                      "Confirm Password need to be same with Password"
                    )
                  }),
                  gender: Yup.mixed().required('This field is required!'),
                  email: Yup.string().email('Email is not valid!').required('This field is required!'),
                  number: Yup.string().matches(/^\+?[0-9]\s?[-]\s|[0-9]$/, 'Text Number is incorrect!')
                                      .required('This field is required!'),
                  county: Yup.mixed().required('This field is required!'),
                  city: Yup.string().required('This field is required!'),
                  zip_code: Yup.string().required('This field is required!'),
                  street: Yup.string().required('This field is required!')
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
                      <Label for="password" className="mt-2">
                        Password:
                        <span className="explain" id="password">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="password">
                        Password
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
                        <Input
                          name="password"
                          type="password"
                          value={values.password || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.password && touched.password}
                        />
                        <FormFeedback>{errors.password}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="confirm" className="mt-2">
                        Confirm Password:
                        <span className="explain" id="confirm">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="confirm">
                        Confirm Password
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
                        <Input
                          name="confirm"
                          type="password"
                          value={values.confirm || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={!!errors.confirm && touched.confirm}
                        />
                        <FormFeedback>{errors.confirm}</FormFeedback>
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
                        <div className="mt-2">
                          <CustomInput 
                            type="radio"
                            name="gender"
                            id="male"
                            label="Male"
                            onClick={() => {
                              setFieldValue('gender', 1)
                            }}
                            inline
                          />
                          <CustomInput
                            type="radio"
                            name="gender"
                            id="female" 
                            label="Female"
                            onClick={() => {
                              setFieldValue('gender', 2)
                            }}
                            inline
                          />
                        </div>
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
                        <Select
                          name="state"
                          classNamePrefix={!!errors.state && touched.state ? 'invalid react-select-lg' : 'react-select-lg'}
                          indicatorSeparator={null}
                          options={states}
                          getOptionValue={option => option.value}
                          getOptionLabel={option => option.label}
                          value={values.state}
                          onChange={(option) => {
                            setFieldValue('state', option);
                          }}
                          onBlur={this.handleBlur}
                        />
                        {!!errors.state && touched.state && (
                          <FormFeedback className="d-block">{errors.state}</FormFeedback>
                        )}
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
                        <Select
                          name="county"
                          classNamePrefix={!!errors.county && touched.county ? 'invalid react-select-lg' : 'react-select-lg'}
                          indicatorSeparator={null}
                          options={counties.filter(county => county.state == values.state.value)}
                          getOptionValue={option => option.code}
                          getOptionLabel={option => option.name}
                          value={values.county}
                          onChange={(option) => {
                            setFieldValue('county', option);
                          }}
                          onBlur={this.handleBlur}
                        />
                        {!!errors.county && touched.county && (
                          <FormFeedback className="d-block">{errors.county}</FormFeedback>
                        )}
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
                        <Select
                          name="city"
                          classNamePrefix={!!errors.city && touched.city ? 'invalid react-select-lg' : 'react-select-lg'}
                          indicatorSeparator={null}
                          options={cities.filter(city => city.state == values.state.value)}
                          getOptionValue={option => option.code}
                          getOptionLabel={option => option.name}
                          value={values.city}
                          onChange={(option) => {
                            setFieldValue('city', option);
                          }}
                          onBlur={this.handleBlur}
                        />
                        {!!errors.city && touched.city && (
                          <FormFeedback className="d-block">{errors.city}</FormFeedback>
                        )}
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
                        <Select
                          name="zip_code"
                          classNamePrefix={!!errors.zip_code && touched.zip_code ? 'invalid react-select-lg' : 'react-select-lg'}
                          indicatorSeparator={null}
                          options={zip_codes.filter(zip_code => zip_code.state == values.state.value)}
                          getOptionValue={option => option.code}
                          getOptionLabel={option => option.label}
                          value={values.zip_code}
                          onChange={(option) => {
                            setFieldValue('zip_code', option);
                          }}
                          onBlur={this.handleBlur}
                        />
                        {!!errors.zip_code && touched.zip_code && (
                          <FormFeedback className="d-block">{errors.zip_code}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="street" className="mt-2">
                        (without house or building number) Street Name:
                        <span className="explain" id="street">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="street">
                        (without house or building number) Street Name
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
                        />
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
                        />
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
                        Text/Phone Number:
                        <span className="explain" id="number">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="number">
                        Text/Phone Number
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <FormGroup>
                        <NumberFormat
                          name="number"
                          className={!!errors.number && touched.number ? 'is-invalid form-control' : 'form-control'}
                          format="(###) ###-####"
                          allowEmptyFormatting mask="_"
                          value={values.number || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {!!errors.number && touched.number && (
                          <FormFeedback className="d-block">{errors.number}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6" sm="4" className="text-right">
                      <Label for="major" className="mt-2">
                        My Interests:
                        <span className="explain" id="major">?</span>
                      </Label>
                      <UncontrolledTooltip placement="right" target="major">
                        My Interests
                      </UncontrolledTooltip>
                    </Col>
                    <Col xs="6" sm="4">
                      <Label className="mt-2">
                        Please check the following Areas of Interest in
                        which you would like us to notify you of contests created and/or starting soon.
                        You may update these anytime by reviewing your profile page.
                      </Label>
                      <FormGroup>
                        <div>
                          {
                            majorcat.map((item, index) => (
                              <CustomInput
                                key={index}
                                name="major"
                                type="checkbox"
                                id={item.value}
                                label={item.label}
                                onClick={(option) => {
                                  let { majorChecked } = this.state;

                                  if (option.target.checked) {
                                    majorChecked.push(item.value);
                                  } else {
                                    const id = majorChecked.indexOf(item.value);

                                    if (id > -1) {
                                      majorChecked.splice(id, 1);
                                    }
                                  }

                                  setFieldValue('major', majorChecked);
                                }}
                              />
                            ))
                          }
                        </div>
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