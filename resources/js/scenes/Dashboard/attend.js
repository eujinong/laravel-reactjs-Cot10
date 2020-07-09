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
  Form, FormGroup, FormFeedback,
  Input, Button,
  UncontrolledAlert,
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
      photoUrl: ['', '', ''],
      filename: ['', '', '']
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
    }
  }

  fileUpload(id, e) {
    e.preventDefault();
    const reader = new FileReader();

    let file = e.target.files[0];

    reader.onloadend = () => {
      const { photoUrl, filename } = this.state;

      photoUrl[id] = reader.result;
      filename[id] = file.name;

      this.setState({
        photoUrl,
        filename
      });
    };

    reader.readAsDataURL(file);
  }

  async handleSubmit(values, bags) {
    const {
      member_id,
      contest_id,
      photoUrl,
      filename
    } = this.state;
    
    let newData = {};

    newData = {
      member_id,
      contest_id,
      photoUrl,
      filename,
      title: values.title,
      photo_title: values.photo_title,
      short_desc: values.short_desc,
      photo_title2: values.photo_title2,
      long_desc: values.long_desc,
      link: values.link,
      link_desc: values.link_desc,
      photo_title3: values.photo_title3,
      summary: values.summary
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

  handleAccount() {
    this.props.history.push('/account');
  }

  handleSignout() {
    localStorage.removeItem('auth');

    this.props.history.push('/signin');
  }

  render() {
    const { photoUrl } = this.state;

    let $photo = [];

    for (let i = 0; i < 3; i++) {
      if (photoUrl[i]) {
        $photo.push(<img src={photoUrl[i]} />);
      } else {
        $photo.push(<img src={Bitmaps.entry} alt="Cot10" />);
      }
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

        <Menu />

        <div className="dashboard container">
          <Formik
            ref={this.formikRef}

            initialValues={{
              title: '',
              photo_title: '',
              short_desc: '',
              long_desc: '',
              link: '',
              link_desc: '',
              summary: ''
            }}

            validationSchema={
              Yup.object().shape({
                title: Yup.string().required('This field is required!'),
                photo_title: Yup.string().required('This field is required!'),
                short_desc: Yup.string().required('This field is required!'),
                long_desc: Yup.string().required('This field is required!'),
                summary: Yup.string().required('This field is required!')
              })
            }

            onSubmit={this.handleSubmit.bind(this)}

            render = {({
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
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <Input
                        type="text"
                        name="title"
                        placeholder="Title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={!!errors.title && touched.title}
                      />
                      <FormFeedback>{errors.title}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <div className={photoUrl[0] ? 'image-preview is_image' : 'image-preview'}>
                        {$photo[0]}
                      </div>
                      <Input
                        ref="file"
                        type="file"
                        key={this.state.fileKey}
                        multiple={false}
                        onChange={this.fileUpload.bind(this, 0)}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <Input
                        type="text"
                        name="photo_title"
                        placeholder="Photo Title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={!!errors.photo_title && touched.photo_title}
                      />
                      <FormFeedback>{errors.photo_title}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <Input
                        type="textarea"
                        name="short_desc"
                        placeholder="Short Description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={!!errors.short_desc && touched.short_desc}
                      />
                      <FormFeedback>{errors.short_desc}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <div className={photoUrl[1] ? 'image-preview is_image' : 'image-preview'}>
                        {$photo[1]}
                      </div>
                      <Input
                        ref="file2"
                        type="file"
                        key={this.state.fileKey}
                        multiple={false}
                        onChange={this.fileUpload.bind(this, 1)}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <Input
                        type="text"
                        name="photo_title2"
                        placeholder="Photo Title 2"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <Input
                        type="textarea"
                        name="long_desc"
                        placeholder="Long Description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={!!errors.long_desc && touched.long_desc}
                      />
                      <FormFeedback>{errors.long_desc}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <Input
                        type="text"
                        name="link"
                        placeholder="Potential Link"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={!!errors.link && touched.link}
                      />
                      <FormFeedback>{errors.link}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <Input
                        type="textarea"
                        name="link_desc"
                        placeholder="Link Description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={!!errors.link_desc && touched.link_desc}
                      />
                      <FormFeedback>{errors.link_desc}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <div className={photoUrl[2] ? 'image-preview is_image' : 'image-preview'}>
                        {$photo[2]}
                      </div>
                      <Input
                        ref="file3"
                        type="file"
                        key={this.state.fileKey}
                        multiple={false}
                        onChange={this.fileUpload.bind(this, 2)}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <Input
                        type="text"
                        name="photo_title3"
                        placeholder="Photo Title 3"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <FormGroup>
                      <Input
                        type="textarea"
                        name="summary"
                        placeholder="Summary"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={!!errors.summary && touched.summary}
                      />
                      <FormFeedback>{errors.summary}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <div className="w-100 d-flex justify-content-center mb-5">
                  <Button
                    className="mr-5"
                    disabled={isSubmitting}
                    type="submit"
                    color="success"
                  >
                    <i className="fa fa-users"></i> VOTE AS BEST
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