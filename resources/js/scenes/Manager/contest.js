import React, { Component, Fragment } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  withRouter
} from 'react-router-dom';

import {
  Row, Col,
  Button,
  Form, FormGroup, FormFeedback,
  UncontrolledAlert,
  Alert,
  Input, Label
} from 'reactstrap';
import Select from 'react-select';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

import { Flag, Sort } from '../../configs/data';

import Api from '../../apis/app';

import ParticipantTable from '../../components/ParticipantTable';
import TopBar from '../../components/TopBar';
import Menu from '../../components/Menu';

import Bitmaps from '../../theme/Bitmaps';

class Contest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initstarting: [],
      starting: [],
      initrunning: [],
      running: [],
      members: [],
      process: '',
      status: 'starting',
      show: 0,
      sort: 'starting',
      majorcat: [],
      subcat: [],
      subfull: [],
      name: '',
      major: '',
      sub: '',
      start_date: null,
      alertVisible: false,
      messageStatus: false,
      successMessage: '',
      failMessage: '',
    }

    this.formikRef = React.createRef();
  }

  async componentDidMount() {
    const contests = await Api.get('contests');
    switch (contests.response.status) {
      case 200:
        this.setState({
          initstarting: contests.body.contests.filter(item => item.status == 'open'),
          starting: contests.body.contests.filter(item => item.status == 'open'),
          initrunning: contests.body.contests.filter(item => item.status == 'running'),
          running: contests.body.contests.filter(item => item.status == 'running')
        });
        break;
      default:
        break;
    }

    const categories = await Api.get('categories');
    switch (categories.response.status) {
      case 200:
        let majorcat = [{value: 0, label: "All Available Contests"}];
        let subfull = [];

        categories.body.major.filter(cat => cat.active == 1).map(item => {
          majorcat.push({value: item.id, label: item.name});
        });

        categories.body.sub.filter(cat => cat.active == 1).map(item => {
          subfull.push({parent_id:item.parent_id, value: item.id, label: item.name});
        });

        this.setState({
          majorcat,
          subfull
        });
        break;
      default:
        break;
    }
  }

  async handleProcess(id) {
    const detail = await Api.get(`contest/${id}`);
    switch (detail.response.status) {
      case 200:
        this.setState({
          process: id,
          members: detail.body.members
        });
        break;
      default:
        break;
    }
  }

  async handleSubmit(values, bags) {
    const user = JSON.parse(localStorage.getItem('auth'));

    let newData = {};
    
    newData = {
      category_id: values.sub.value,
      creator_id: user.user.member_info.id,
      name: values.name,
      round_days: values.round_days,
      allow_video: values.allow_video.value,
      start_date: this.state.start_date,
      gole: values.gole,
      rule: values.rule,
      ending: values.ending,
      note: values.note
    }

    const data = await Api.post('create-contest', newData);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          alertVisible: true,
          messageStatus: true,
          successMessage: 'Created Successfully!',
          initstarting: body.contests.filter(item => item.status == 'open'),
          starting: body.contests.filter(item => item.status == 'open'),
          initrunning: body.contests.filter(item => item.status == 'running'),
          running: body.contests.filter(item => item.status == 'running')
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

  onChangeStart(event, data) {
    if (data.value) {
      let start_date = this.convertDate(data.value);

      this.setState({
        start_date
      });
    } else {
      this.setState({
        start_date: null
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
      initstarting,
      starting,
      initrunning,
      running,
      members,
      process,
      status,
      show,
      sort,
      majorcat,
      subcat,
      subfull,
      name,
      major,
      sub,
      start_date
    } = this.state;

    return (
      <Fragment>
        <TopBar type="contest" />

        <Menu type="contest" />
        
        <div className="dashboard container">
          <Row>
            <Col className="panel" sm="6">
              <Button
                className={status == 'starting' ? 'active' : ''}
                outline
                color="info"
                onClick={() => 
                  this.setState({
                    status: 'starting',
                    starting: initstarting,
                    name: '',
                    major: '',
                    start_date: '',
                    show: 0
                  })
                }
              >
                Contests Starting Soon
              </Button>
              <Button
                className={status == 'new' ? 'active' : ''}
                outline
                color="info"
                onClick={() => this.setState({status: 'new'})}
              >
                Build New Contest
              </Button>
              <Button
                className={status == 'running' ? 'active' : ''}
                outline
                color="info"
                onClick={() => 
                  this.setState({
                    status: 'running',
                    running: initrunning,
                    name: '',
                    major: '',
                    start_date: '',
                    show: 0
                  })
                }
              >
                Contests Running
              </Button>
            </Col>
            <Col className="d-flex contest" sm="6">
              {
                status == 'new' ? (
                  <Fragment>
                    <div className="mx-3">
                      <img src={Bitmaps.contest} />
                    </div>
                    <div className="mx-3">
                      <h4>{name}</h4>
                      <Row>
                        <Col sm="6" className="text-right">Major Category:</Col>
                        <Col sm="6">{major}</Col>
                      </Row>
                      <Row>
                        <Col sm="6" className="text-right">Sub Category:</Col>
                        <Col sm="6">{sub}</Col>
                      </Row>
                      <Row>
                        <Col sm="6" className="text-right">Start Date:</Col>
                        <Col sm="6">{start_date}</Col>
                      </Row>
                    </div>
                  </Fragment>
                ) : (
                  <Row className="w-100">
                      <Col sm="4" className="text-right">
                        <Label className="mt-2">Show</Label>
                      </Col>
                      <Col sm="8">
                        <FormGroup>
                          <Select
                            classNamePrefix="react-select-lg"
                            indicatorSeparator={null}
                            options={majorcat}
                            getOptionValue={option => option.value}
                            getOptionLabel={option => option.label}
                            value={majorcat.filter(item => item.value == show)[0]}
                            onChange={(option) => {
                              if (status == 'starting') {
                                if (option.value == 0) {
                                  this.setState({
                                    starting: initstarting
                                  });
                                } else {
                                  this.setState({
                                    starting: initstarting.filter(item => item.parent_id == option.value)
                                  });
                                }
                              }

                              if (status == 'running') {
                                if (option.value == 0) {
                                  this.setState({
                                    running: initrunning
                                  });
                                } else {
                                  this.setState({
                                    running: initrunning.filter(item => item.parent_id == option.value)
                                  });
                                }
                              }

                              this.setState({
                                show: option.value
                              });
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="4" className="text-right">
                        <Label className="mt-2">Sort By</Label>
                      </Col>
                      <Col sm="8">
                        <FormGroup>
                          <Select
                            classNamePrefix="react-select-lg"
                            indicatorSeparator={null}
                            options={Sort}
                            getOptionValue={option => option.value}
                            getOptionLabel={option => option.label}
                            value={Sort.filter(item => item.value == sort)[0]}
                            onChange={(option) => {
                              this.setState({
                                sort: option.value
                              });
                            }}
                          />
                        </FormGroup>
                      </Col>
                  </Row>
                )
              }
            </Col>
          </Row>
          <hr />
          {
            status == 'starting' && (
              starting.length > 0 && (
                <Row>
                  {
                    starting.map((item, index) => (
                      <Col className="d-flex contest" sm="6" key={index}>
                        <div className="mx-3 my-1">
                          <img src={Bitmaps.contest} />
                        </div>
                        <div className="mx-3 my-1">
                          <h4>{item.name}</h4>
                          <Row>
                            <Col sm="8" className="text-right">Major Category:</Col>
                            <Col sm="4">{item.major}</Col>
                          </Row>
                          <Row>
                            <Col sm="8" className="text-right">Sub Category:</Col>
                            <Col sm="4">{item.sub}</Col>
                          </Row>
                          <Row>
                            <Col sm="8" className="text-right">Vote Before:</Col>
                            <Col sm="4">{item.start_date}</Col>
                          </Row>
                          <Row>
                            <Col sm="8" className="text-right"># of entries started/active:</Col>
                            <Col sm="4"></Col>
                          </Row>
                        </div>
                      </Col>
                    ))
                  }
                </Row>
              )
            )
          }
          {
            status == 'new' && (
              <Fragment>
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
                    name: '',
                    major: null,
                    sub: null,
                    start_date: null,
                    round_days: '',
                    allow_video: null,
                    gole: '',
                    rule: '',
                    ending: '',
                    note: ''
                  }}

                  validationSchema={
                    Yup.object().shape({
                      name: Yup.string().required('This field is required!'),
                      major: Yup.mixed().required('This field is required!'),
                      sub: Yup.mixed().required('This field is required!'),
                      round_days: Yup.string().required('This field is required!'),
                      allow_video: Yup.mixed().required('This field is required!'),
                      gole: Yup.string().required('This field is required!'),
                      rule: Yup.string().required('This field is required!'),
                      ending: Yup.string().required('This field is required!')
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
                          <Row>
                            <Col sm="4" className="text-right">
                              <Label className="mt-2" for="name">Contest Name:</Label>
                            </Col>
                            <Col sm="8">
                              <FormGroup>
                                <Input
                                  name="name"
                                  type="text"
                                  value={values.name || ''}
                                  onChange={(value) => {
                                    setFieldValue('name', value.target.value);
                                    
                                    this.setState({
                                      name: value.target.value
                                    });
                                  }}
                                  onBlur={handleBlur}
                                  invalid={!!errors.name && touched.name}
                                />
                                <FormFeedback>{errors.name}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col sm="4" className="text-right">
                              <Label className="mt-2" for="major">Major Category:</Label>
                            </Col>
                            <Col sm="8">
                              <FormGroup>
                                <Select
                                  name="major"
                                  classNamePrefix={!!errors.major && touched.major ? 'invalid react-select-lg' : 'react-select-lg'}
                                  indicatorSeparator={null}
                                  options={majorcat.filter(item => item.value != 0)}
                                  getOptionValue={option => option.value}
                                  getOptionLabel={option => option.label}
                                  value={values.major}
                                  onChange={(option) => {
                                    setFieldValue('major', option);

                                    this.setState({
                                      subcat: subfull.filter(item => item.parent_id == option.value),
                                      major: option.label
                                    });
                                  }}
                                  onBlur={this.handleBlur}
                                />
                                {!!errors.major && touched.major && (
                                  <FormFeedback className="d-block">{errors.major}</FormFeedback>
                                )}
                              </FormGroup>
                            </Col>
                            <Col sm="4" className="text-right">
                              <Label className="mt-2" for="sub">Sub Category:</Label>
                            </Col>
                            <Col sm="8">
                              <FormGroup>
                                <Select
                                  name="sub"
                                  classNamePrefix={!!errors.sub && touched.sub ? 'invalid react-select-lg' : 'react-select-lg'}
                                  indicatorSeparator={null}
                                  options={subcat}
                                  getOptionValue={option => option.value}
                                  getOptionLabel={option => option.label}
                                  value={values.sub}
                                  onChange={(option) => {
                                    setFieldValue('sub', option);

                                    this.setState({
                                      sub: option.label
                                    });
                                  }}
                                  onBlur={this.handleBlur}
                                />
                                {!!errors.sub && touched.sub && (
                                  <FormFeedback className="d-block">{errors.sub}</FormFeedback>
                                )}
                              </FormGroup>
                            </Col>
                            <Col sm="4" className="text-right">
                              <Label className="mt-2" for="start_date">Start Date:</Label>
                            </Col>
                            <Col sm="8">
                              <FormGroup className={!start_date && touched.start_date ? 'invalid calendar' : 'calendar'}>
                                <SemanticDatepicker
                                  name="start_date"
                                  placeholder="Start Date"
                                  onChange={this.onChangeStart.bind(this)}
                                />
                                {!start_date && touched.start_date && (
                                  <FormFeedback className="d-block">This field is required!</FormFeedback>
                                )}
                              </FormGroup>
                            </Col>
                            <Col sm="4" className="text-right">
                              <Label className="mt-2" for="round_days"># of Days between rounds:</Label>
                            </Col>
                            <Col sm="8">
                              <FormGroup>
                                <Input
                                  name="round_days"
                                  type="text"
                                  value={values.round_days || ''}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={!!errors.round_days && touched.round_days}
                                />
                                <FormFeedback>{errors.round_days}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col sm="4" className="text-right">
                              <Label className="mt-2" for="allow_video">Allow for Video Link:</Label>
                            </Col>
                            <Col sm="8">
                              <FormGroup>
                                <Select
                                  name="allow_video"
                                  classNamePrefix={!!errors.allow_video && touched.allow_video ? 'invalid react-select-lg' : 'react-select-lg'}
                                  indicatorSeparator={null}
                                  options={Flag}
                                  getOptionValue={option => option.value}
                                  getOptionLabel={option => option.label}
                                  value={values.allow_video}
                                  onChange={(option) => {
                                    setFieldValue('allow_video', option);
                                  }}
                                />
                                {!!errors.allow_video && touched.allow_video && (
                                  <FormFeedback className="d-block">{errors.allow_video}</FormFeedback>
                                )}
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs="12" sm="6">
                          <Row>
                            <Col sm="4" className="text-right">
                              <Label className="mt-2" for="gole">Gole:</Label>
                            </Col>
                            <Col sm="8">
                              <FormGroup>
                                <Input
                                  name="gole"
                                  type="textarea"
                                  value={values.gole || ''}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={!!errors.gole && touched.gole}
                                />
                                <FormFeedback>{errors.gole}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col sm="4" className="text-right">
                              <Label className="mt-2" for="rule">Rules:</Label>
                            </Col>
                            <Col sm="8">
                              <FormGroup>
                                <Input
                                  name="rule"
                                  type="textarea"
                                  value={values.rule || ''}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={!!errors.rule && touched.rule}
                                />
                                <FormFeedback>{errors.rule}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col sm="4" className="text-right">
                              <Label className="mt-2" for="ending">Contest Ending:</Label>
                            </Col>
                            <Col sm="8">
                              <FormGroup>
                                <Input
                                  name="ending"
                                  type="textarea"
                                  value={values.ending || ''}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={!!errors.ending && touched.ending}
                                />
                                <FormFeedback>{errors.ending}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col sm="4" className="text-right">
                              <Label className="mt-2" for="note">(optional)  Added Note:</Label>
                            </Col>
                            <Col sm="8">
                              <FormGroup>
                                <Input
                                  name="note"
                                  type="textarea"
                                  value={values.note || ''}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <div className="w-100 text-center">
                        <Button
                          disabled={isSubmitting}
                          type="submit"
                          color="primary"
                        >
                          Submit
                        </Button>
                      </div>
                    </Form>
                  )}
                />
              </Fragment>
            )
          }
          {
            status == 'running' && (
              running.length > 0 && (
                <Fragment>
                  <Row>
                    {
                      running.map((item, index) => (
                        <Col className="d-flex contest" sm="12" key={index}>
                          <div className="mx-3 my-1">
                            <img src={Bitmaps.contest} />
                          </div>
                          <div className="mx-3 my-1">
                            <h4>{item.name}</h4>
                            <Row>
                              <Col sm="3" className="text-right">Major Category:</Col>
                              <Col sm="3">{item.major}</Col>
                              <Col sm="3" className="text-right">Current Round:</Col>
                              <Col sm="3">0</Col>
                            </Row>
                            <Row>
                              <Col sm="3" className="text-right">Sub Category:</Col>
                              <Col sm="3">{item.sub}</Col>
                              <Col sm="3" className="text-right">Review Entries:</Col>
                              <Col sm="3">All</Col>
                            </Row>
                            <Row>
                              <Col sm="3" className="text-right">Vote Before:</Col>
                              <Col sm="3">{item.start_date}</Col>
                              <Col sm="3" className="text-right">
                                <a
                                  className="process-link"
                                  onClick={this.handleProcess.bind(this, item.id)}
                                >
                                  Process End of Round
                                </a>
                              </Col>
                              <Col sm="3"></Col>
                            </Row>
                            <Row>
                              <Col sm="3" className="text-right"># of entries started/active:</Col>
                              <Col sm="3"></Col>
                              <Col sm="3" className="text-right">Message:</Col>
                              <Col sm="3">
                                Still In
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      ))
                    }
                  </Row>
                  <hr />
                  {
                    process != '' && members.length > 0 && (
                      <Row className="mt-3">
                        <Col sm="4">
                          <Row>
                            <Col sm="8" className="text-right">
                              <Label className="mt-2" for="votes">Archive Entries with less than</Label>
                            </Col>
                            <Col sm="4">
                              <FormGroup>
                                <Input
                                  name="votes"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col sm="4">
                        <Row>
                            <Col sm="8" className="text-right">
                              <Label className="mt-2" for="group">Re-Group table with</Label>
                            </Col>
                            <Col sm="4">
                              <FormGroup>
                                <Input
                                  name="group"
                                  type="text"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col className="text-center" sm="4">
                          <Button color="warning">Declare the Winners</Button>
                        </Col>
                        <Col className="mt-2" sm="12">
                          <ParticipantTable
                            items={members}
                          />
                        </Col>
                      </Row>
                    )
                  }
                </Fragment>
              )
            )
          }
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Contest);