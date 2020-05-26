/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {
  Component, Fragment
} from 'react';
import {
  withRouter
} from 'react-router-dom';

import {
  Container, Row, Col,
  FormGroup,
  Card, CardTitle, CardText,
  Toast, ToastBody,
  Input, Button,
  Alert, Media
} from 'reactstrap';
import { Accordion } from 'semantic-ui-react';

import Api from '../../apis/app';

import Bitmaps from '../../theme/Bitmaps';
import { Genders } from '../../configs/data';

class Contests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirm: true,
      passed: false,
      email: '',
      msg: '',
      events: null,
      detail: false,
      participants: [],
      activeIndex: ''
    }
  }

  componentDidMount() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    
    if (auth) {
      this.setState({
        email: auth.email
      });

      this.handleConfirm();
    }
  }

  async handleConfirm() {
    const auth = JSON.parse(localStorage.getItem('auth'));

    let email = '';

    if (auth) {
      email = auth.email;

      this.setState({
        email,
        confirm: true,
        msg: '',
        passed: true
      });
    } else {
      email = this.state.email;
    }

    if (email == '') {
      this.setState({
        confirm: false,
        msg: 'Email is Empty.'
      });
    } else {
      const data = await Api.post('check-participant', {email});
      const { response, body } = data;
      switch (response.status) {
        case 200:
          if (body.data.length > 0) {
            localStorage.setItem('auth', JSON.stringify({email}));

            this.setState({
              events: body.data,
              confirm: true,
              msg: '',
              passed: true
            });

            let url = window.location.pathname;
            url = url.replace('/events', '');
          
            if (url != '') {
              this.getEvent(url.replace('/', ''));
            }
          } else {
            this.setState({
              confirm: false,
              msg: 'Email is not Valid.'
            });
          }
          break;
        default:
          break;
      }
    }
  }

  handleURL(url) {
    this.getEvent(url);

    this.props.history.push('/events/' + url);
  }

  async getEvent(url) {
    const { email } = this.state;

    if (email != '' && email !== null) {
      const params = [];
      params.email = email;
      params.url = url;

      this.setState({
        detail: true
      });

      const data = await Api.post('get-participants', params);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          if (body.participants.length > 0)  {
            this.setState({
              participants: body.participants
            });
          } else {
            this.setState({
              confirm: false,
              passed: false
            });

            this.props.history.push('/');
          }
          break;
        default:
          break;
      }
    }
  }

  handleClick(e, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  async handleVote(flag, id) {
    const { email } = this.state;
    const params = {
      email,
      flag,
      id
    }

    const data = await Api.post('vote', params);
    const { response, body } = data;
    switch (response.status) {
      case 200:
        this.setState({
          participants: body.participants
        });
        break;
      default:
        break;
    }
  }

  handleBack() {
    this.setState({
      detail: false
    });

    this.props.history.push('/events');
  }

  handleSignout() {
    localStorage.removeItem('auth');

    this.props.history.push('/');
  }

  render() {
    const {
      events,
      confirm,
      passed,
      msg,
      email,
      detail,
      participants,
      activeIndex
    } = this.state;

    const colors = ['#a239ca', '#ec576b', '#436eee', '#007849', '#f7882f']
    
    let votes = [];
    let media = [];
    let disable = [];

    let j = 0;
    
    for (let i in participants) {
      if (participants[i].email == email) {
        disable = participants[i].vote_to.split(',');
      } else {
        let vote = participants[i].round_votes;
  
        if (votes.indexOf(vote) == -1) {
          votes.push(vote);
        }
  
        media[j] = [];
  
        for (let key in participants[i]) {
          if (key.substring(0, 5) == 'media' && participants[i][key] != '') {
            media[j].push(participants[i][key]);
          }
        }

        j++;
      }
    }

    votes.sort(function(a, b) {
      return b - a;
    });
    
    return (
      <Fragment>
        <div className="top-header tile-top-bar">
          <a href="/">
            <img src={Bitmaps.logo} alt="Cot10" />
          </a>
        </div>

        <div className="tile-content dashboard">
          {
            detail ? (
              participants.length > 0 && (
                <Container>
                  <div className="mt-3">
                    <Button
                      color="success"
                      onClick={this.handleBack.bind(this)}
                    >
                      Events List
                    </Button>
                    <a
                      className="mt-2"
                      style={{float:"right",cursor:"pointer"}}
                      onClick={this.handleSignout.bind(this)}
                    >
                      <i className="fa fa-user"></i> Sign Out
                    </a>
                  </div>

                  <Alert className="mt-4" color="info">
                    <h2 className="mb-4 text-center text-primary">{participants[0].title}</h2>

                    <h5>
                      <span className="mr-2">Starts on:</span>
                      <span>{participants[0].start_date}</span>
                    </h5>
                    <h5>Description:</h5>
                    <p className="ml-2">{participants[0].description}</p>
                  </Alert>

                  <Media>
                    <Media className="mr-5" left>
                      <Media
                        object
                        src={
                          participants.filter(me => me.email == email)[0].profile_image == ''
                          ? (participants.filter(me => me.email == email)[0].gender == 1 
                            ? Bitmaps.maleAvatar : Bitmaps.femaleAvatar)
                          : '../' + participants.filter(me => me.email == email)[0].profile_image
                        }
                      />
                    </Media>
                    <Media body>
                      <Media heading>
                        <span className="mr-2">Name:</span>
                        <span className="mr-2">{participants.filter(me => me.email == email)[0].firstname}</span>
                        <span className="mr-5">{participants.filter(me => me.email == email)[0].lastname}</span>
                        <span>
                          <span className="mr-2">Votes:</span>
                          <span className="mr-2">
                            {
                              participants.filter(me => me.email == email)[0].round_votes
                            }
                          </span>
                          {
                            votes.length > 1 && (
                              <span className="text-warning">
                                <i className="fa fa-medal mr-1"></i>
                                # {votes.indexOf(participants.filter(me => me.email == email)[0].round_votes) + 1}
                              </span>
                            )
                          }
                        </span>
                      </Media>
                    </Media>
                  </Media>

                  <Row>
                    <Col sm="12" className="mt-3">
                      <Accordion fluid styled>
                        {
                          participants.filter(me => me.email != email).map((member, id) => (
                            <Fragment key={id}>
                              <Row>
                                <Accordion.Title
                                  className="col-sm-6 col-md-8 col-lg-9"
                                  active={activeIndex === id}
                                  index={id}
                                  onClick={this.handleClick.bind(this)}
                                >
                                  <span className="mr-5">
                                    {
                                      activeIndex === id ? (
                                        <i className="fa fa-minus"></i>
                                      ) : (
                                        <i className="fa fa-plus"></i>
                                      )
                                    }
                                  </span>
                                  <img
                                    src={
                                      member.profile_image 
                                        ? '../' + member.profile_image 
                                        : (member.gender == 1 ? Bitmaps.maleAvatar : Bitmaps.femaleAvatar)
                                      } 
                                    className="table-avatar mr-4"
                                  />
                                  <span>{member.firstname} {member.lastname}</span>
                                  <span> , {member.birthday}</span>
                                  <span> , {member.gender == 1 ? Genders[0].name : Genders[1].name}</span>
                                  <span>
                                    <span className="mr-2">Votes:</span>
                                    <span className="mr-2">
                                      {member.round_votes}
                                    </span>
                                    {
                                      votes.length > 1 && (
                                        <span className="text-warning">
                                          <i className="fa fa-medal mr-1"></i>
                                          # {votes.indexOf(member.round_votes) + 1}
                                        </span>
                                      )
                                    }
                                  </span>
                                </Accordion.Title>
                                
                                <div className="vote col-sm-6 col-md-4 col-lg-3">
                                  {
                                    disable.indexOf(member.id.toString()) == -1 && (
                                      <Fragment>
                                        <Button
                                          color="success"
                                          onClick={this.handleVote.bind(this, 'yes', member.id)}
                                        >
                                          <i className="fa fa-check"></i> Yes
                                        </Button>
                                        <Button
                                          color="danger"
                                          onClick={this.handleVote.bind(this, 'no', member.id)}
                                        >
                                          <i className="fa fa-ban"></i> No
                                        </Button>
                                      </Fragment>
                                    )
                                  }
                                </div>
                                
                                <Accordion.Content active={activeIndex === id}>
                                  <div className="ml-5">
                                    {
                                      media[id].map((obj, i) => (
                                        obj.substring(0, 5) == 'files' ? (
                                          <a key={i} href={'../' + obj}>
                                            <i className="fa fa-file"></i> {obj.split("/")[1]}
                                          </a>
                                        ) : (
                                          <a
                                            key={i} 
                                            href={obj.substring(0, 4) == 'http' ? obj : 'http://' + obj}
                                            target="_blank"
                                          >
                                            {obj}
                                          </a>
                                        )
                                      ))
                                    }
                                  </div>
                                </Accordion.Content>
                              </Row>
                            </Fragment>
                          ))
                        }
                      </Accordion>
                    </Col>
                  </Row>
                </Container>
              )
            ) : (
              <Container>
                {
                  passed && (
                    <div className="mt-3" style={{height:"25px"}}>
                      <a
                        className="mt-2"
                        style={{float:"right",cursor:"pointer"}}
                        onClick={this.handleSignout.bind(this)}
                      >
                        <i className="fa fa-user"></i> Sign Out
                      </a>
                    </div>
                  )
                }

                <h2 className="text-center mt-4 text-primary">Welcome to our Events.</h2>
                
                {
                  passed ? (
                    <Row className="tiles mt-2">
                      {
                        events && events.length > 0 && (
                          events.map((item, index) => (
                            <Col md="3" sm="6" xs="12" key={index}>
                              <Card body inverse
                                onClick={this.handleURL.bind(this, item.url)}
                                style={{ backgroundColor: colors[index % 5], borderColor: colors[index % 5] }}
                              >
                                <CardTitle>
                                  <i className="fa fa-users"></i>
                                </CardTitle>
                                <CardText>{item.title}</CardText>
                              </Card>
                            </Col>
                          ))
                        )
                      }
                    </Row>
                  ) : (
                    <Toast>
                      <ToastBody>
                        <h5 className="text-center">
                          Please confirm your email now.
                        </h5>

                        <Row className="mt-5">
                          <Col sm="4">
                            <h5 className="mt-2 text-right">Your Email Address : </h5>
                          </Col>
                          <Col sm="4">
                            <FormGroup>
                              <Input
                                type="text"
                                name="email"
                                onChange={e => (
                                  this.setState({
                                    email: e.target.value
                                  })
                                )}
                                onKeyPress={event => {
                                  if (event.key === 'Enter') {
                                    this.handleConfirm.bind(this)();
                                  }
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col sm="4">
                            <FormGroup>
                              <Button
                                color="success"
                                onClick={this.handleConfirm.bind(this)}
                              >
                                Confirm
                              </Button>
                            </FormGroup>
                          </Col>
                          {!confirm && (
                            <Col sm="12">
                              <h4 className="text-danger text-center mb-2 font-weight-bold">{msg}</h4>
                            </Col>
                          )}
                        </Row>
                      </ToastBody>
                    </Toast>
                  )
                }
              </Container>
            )
          }
          
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Contests);