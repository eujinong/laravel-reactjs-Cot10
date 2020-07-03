import React, { Component, Fragment } from 'react';
import {
  withRouter
} from 'react-router-dom';

import {
  Row, Col,
  Button,
  FormGroup,
  Label
} from 'reactstrap';
import Select from 'react-select';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

import { Sort } from '../../configs/data';

import Api from '../../apis/app';

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
      status: 'starting',
      show: 0,
      sort: 'starting',
      majorcat: [],
      alertVisible: false,
      messageStatus: false,
      successMessage: '',
      failMessage: ''
    }

    this.formikRef = React.createRef();
  }

  async componentDidMount() {
    const contests = await Api.get('all-contests');
    switch (contests.response.status) {
      case 200:
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

  handleDetail(id) {
    this.props.history.push('/web/detail', {id, review: 'all'});
  }

  render() { 
    const {
      parts,
      initstarting, starting,
      initrunning, running,
      status, show, sort,
      majorcat
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
                          <a
                            className="process-link"
                            onClick={this.handleDetail.bind(this, item.id)}
                          >
                            <h4 className="mb-2">{item.name}</h4>
                          </a>
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
                        <Col className="d-flex contest" sm="6" key={index}>
                          <div className="mx-3 my-1">
                            <img src={Bitmaps.contest} />
                          </div>
                          <div className="mx-3 my-1">
                            <a
                              className="process-link"
                              onClick={this.handleDetail.bind(this, item.id)}
                            >
                              <h4 className="mb-2">{item.name}</h4>
                            </a>
                            <Row>
                              <Col sm="6" className="text-right">Major Category:</Col>
                              <Col sm="6">{item.major}</Col>
                            </Row>
                            <Row>
                              <Col sm="6" className="text-right">Sub Category:</Col>
                              <Col sm="6">{item.sub}</Col>
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