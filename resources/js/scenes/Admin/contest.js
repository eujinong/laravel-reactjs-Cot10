import React, { Component, Fragment } from 'react';
import {
  withRouter
} from 'react-router-dom';

import {
  Row, Col,
  Button,
  FormGroup,
  Input, Label
} from 'reactstrap';
import Select from 'react-select';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

import { Sort } from '../../configs/data';

import Api from '../../apis/app';

import ParticipantTable from '../../components/ParticipantTable';
import TopBar from '../../components/TopBar';

import Bitmaps from '../../theme/Bitmaps';

class Contest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parts: [],
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
      alertVisible: false,
      messageStatus: false,
      successMessage: '',
      failMessage: '',
      archive: 0,
      group: 0
    }

    this.formikRef = React.createRef();
  }

  async componentDidMount() {
    const contests = await Api.get('all-contests');
    switch (contests.response.status) {
      case 200:console.log(contests.body);
        this.setState({
          parts: contests.body.participants,
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

  handleDetail(id) {
    this.props.history.push('/contest/detail', id);
  }

  handleReviewAll(id) {
    this.props.history.push('/contest/allreview', {id, review: 'all'});
  }

  handleReviewActive(id) {
    this.props.history.push('/contest/activereview', {id, review: 'active'});
  }

  render() { 
    const {
      parts,
      initstarting, starting,
      initrunning, running,
      members,
      process, status, show, sort,
      majorcat,
      archive, group
    } = this.state;

    return (
      <Fragment>
        <TopBar type="web" />
        
        <div className="dashboard container">
          <Row>
            <Col className="panel px-5" sm="12" md="6">
              <Button
                className={status == 'starting' ? 'active' : ''}
                outline
                color="info"
                onClick={() => 
                  this.setState({
                    status: 'starting',
                    starting: initstarting,
                    show: 0
                  })
                }
              >
                Contests Starting Soon
              </Button>
              <Button
                className={status == 'running' ? 'active' : ''}
                outline
                color="info"
                onClick={() => 
                  this.setState({
                    status: 'running',
                    running: initrunning,
                    show: 0
                  })
                }
              >
                Contests Running
              </Button>
            </Col>
            <Col className="d-flex contest px-5" sm="12" md="6">
              <Row className="w-100">
                <Col xs="4" className="text-right">
                  <Label className="mt-2">Show</Label>
                </Col>
                <Col xs="8">
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
                <Col xs="4" className="text-right">
                  <Label className="mt-2">Sort By</Label>
                </Col>
                <Col xs="8">
                  <FormGroup>
                    <Select
                      classNamePrefix="react-select-lg"
                      indicatorSeparator={null}
                      options={Sort}
                      getOptionValue={option => option.value}
                      getOptionLabel={option => option.label}
                      value={Sort.filter(item => item.value == sort)[0]}
                      onChange={(option) => {
                        let key = '';

                        switch (option.value) {
                          case 'starting':
                            key = 'start_date';
                            break;
                          case 'popular':
                            key = 'id';
                            break;
                          case 'alpha':
                            key = 'name'
                            break;
                        }

                        if (status == 'starting') {
                          let arr =  starting.sort(function(a, b) {
                            let x = a[key];
                            let y = b[key];

                            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                          });

                          this.setState({
                            starting: arr,
                            sort: option.value
                          });
                        }

                        if (status == 'running') {
                          let arr =  running.sort(function(a, b) {
                            let x = a[key];
                            let y = b[key];

                            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                          });

                          this.setState({
                            running: arr,
                            sort: option.value
                          });
                        }
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
          {
            status == 'starting' && (
              starting.length > 0 && (
                <Row>
                  {
                    starting.map((item, index) => (
                      <Col className="d-flex contest" md="12" lg="6" key={index}>
                        <div className="mx-3 my-1">
                          <img src={Bitmaps.contest} />
                        </div>
                        <div className="mx-3 my-1">
                          <h4>{item.name}</h4>
                          <Row>
                            <Col sm="6" className="text-right">Major Category:</Col>
                            <Col sm="6">{item.major}</Col>
                          </Row>
                          <Row>
                            <Col sm="6" className="text-right">Sub Category:</Col>
                            <Col sm="6">{item.sub}</Col>
                          </Row>
                          <Row>
                            <Col sm="6" className="text-right">Start Date:</Col>
                            <Col sm="6">{item.start_date}</Col>
                          </Row>
                          <Row>
                            <Col sm="6" className="text-right"># of entries started/active:</Col>
                            <Col sm="6">
                              {
                                parts.filter(part => part.contest_id == item.id).length > 0
                                  ? parts.filter(part => part.contest_id == item.id)[0]['parts']
                                  : 0
                              }
                            </Col>
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
                            <a
                              className="process-link"
                              onClick={this.handleDetail.bind(this, item.id)}
                            >
                              <h4>{item.name}</h4>
                            </a>
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
                              <Col sm="3">
                                <a
                                  className="process-link mr-2"
                                  onClick={this.handleReviewAll.bind(this, item.id)}
                                >
                                  All
                                </a>
                                <a
                                  className="process-link"
                                  onClick={this.handleReviewActive.bind(this, item.id)}
                                >
                                  Active
                                </a>
                              </Col>
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
                              <Col sm="3">
                                {
                                parts.filter(part => part.contest_id == item.id).length > 0
                                  ? parts.filter(part => part.contest_id == item.id)[0]['parts']
                                  : 0
                                }
                              </Col>
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
                      <Row className="my-3">
                        <Col sm="4">
                          <Row>
                            <Col sm="8" className="text-right">
                              <Label className="mt-2" for="votes">Archive Entries with less than</Label>
                            </Col>
                            <Col sm="4">
                              <FormGroup>
                                <Input
                                  name="archive"
                                  type="text"
                                  onChange={value => {
                                    this.setState({
                                      archive: value.currentTarget.value
                                    });
                                  }}
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
                                  onChange={value => {
                                    this.setState({
                                      group: value.currentTarget.value
                                    });
                                  }}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                        <Col className="text-right" sm="4">
                          <Button color="warning">Declare the Winners</Button>
                        </Col>
                        <Col className="mt-2" sm="12">
                          <ParticipantTable
                            items={members}
                            archive={archive}
                            group={group}
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