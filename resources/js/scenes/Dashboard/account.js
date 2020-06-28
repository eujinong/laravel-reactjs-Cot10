/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {
  Component, Fragment
} from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Row, Col,
  Button,
  Container,
  Form, FormGroup, FormFeedback,
  Input, Label, CustomInput, Alert,
  UncontrolledAlert,
  UncontrolledTooltip
} from 'reactstrap';
import {
  withRouter
} from 'react-router-dom';

import NumberFormat from 'react-number-format';
import Select from 'react-select';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import Menu from '../../components/Menu';
import Api from '../../apis/app';
import Bitmaps from '../../theme/Bitmaps';
import { countries, counties, cities } from '../../configs/data';

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      member: [],
      majorcat: [],
      majorChecked: [],
      imagePreviewUrl: '',
      fileKey: 1,
      alertVisible: false,
      messageStatus: false,
      successMessage: '',
      failMessage: '',
    }

    this.formikRef = React.createRef();
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('auth'));
    
    const data = await Api.get('get-account', {member_id: user.user.member_info.id});
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          member: body.member
        });
        break;
      default:
        break;
    }

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

    this.settingValues();
  }

  settingValues() {
    const {
      member
    } = this.state;
    const {
      formikRef
    } = this;

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

    const values = member;

    const major = values.major_ids.split(',');

    const majorChecked = [];
    for (var i in major) {
      major[i] = parseInt(major[i]);
      majorChecked.push(major[i]);
    }
    this.setState({
      majorChecked
    });

    formikRef.current.setValues({
      profile_image: values.profile_image,
      firstname: values.firstname,
      lastname: values.lastname,
      gender: values.gender,
      email: values.email,
      number: values.number,
      country: countries.filter(item => item.countryCode == values.country)[0],
      state: states.filter(item => item.value == values.state)[0],
      county: counties.filter(item => item.code == values.county)[0],
      city: cities.filter(item => item.code == values.city)[0],
      zip_code: zip_codes.filter(item => item.code == values.zip_code)[0],
      street: values.street,
      building: values.building,
      apartment: values.apartment,
      major
    });
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
    const user = JSON.parse(localStorage.getItem('auth'));
    const member_id = user.user.member_info.id;

    const { imagePreviewUrl } = this.state;

    let newData = {
      profile_image: imagePreviewUrl || '',
      firstname: values.firstname,
      lastname: values.lastname,
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

    const data = await Api.put(`account/${member_id}`, newData);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          alertVisible: true,
          messageStatus: true,
          successMessage: 'Updated Successfully!'
        });

        window.scrollTo(0, 0);

        setTimeout(() => {
          this.setState({ alertVisible: false });
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
          failMessage: body.data
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

  handleAccount() {
    this.props.history.push('/account');
  }

  handleSignout() {
    localStorage.removeItem('auth');

    this.props.history.push('/signin');
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

        <Menu type="member" />

        <div className="dashboard container">
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
                            checked={values.gender == 1 || ''}
                            onChange={() => {
                              setFieldValue('gender', 1)
                            }}
                            inline
                          />
                          <CustomInput
                            type="radio"
                            name="gender"
                            id="female" 
                            label="Female"
                            checked={values.gender == 2 || ''}
                            onChange={() => {
                              setFieldValue('gender', 2)
                            }}
                            inline
                          />
                        </div>
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
                          classNamePrefix={'react-select-lg'}
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
                          classNamePrefix={'react-select-lg'}
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
                          classNamePrefix={'react-select-lg'}
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
                          classNamePrefix={'react-select-lg'}
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
                          classNamePrefix={'react-select-lg'}
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
                          disabled={true}
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
                                checked={values.major && values.major.includes(item.value) || ''}
                                onChange={(option) => {
                                  let { majorChecked } = this.state;

                                  if (option.target.checked) {
                                    majorChecked.push(item.value);
                                  } else {
                                    const id = majorChecked.indexOf(item.value);

                                    if (id > -1) {
                                      majorChecked.splice(id, 1);
                                    }
                                  }
                                  console.log(majorChecked)
                                  this.setState({
                                    majorChecked
                                  });

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
                      color="success"
                    >
                      Update
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

export default withRouter(Account);